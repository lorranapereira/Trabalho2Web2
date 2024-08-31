const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const createRestaurant = async (req, res) => {
    const { name, location, openingHours, description } = req.body;
    const userId = req.userId;

    try {
        const restaurant = await prisma.restaurant.create({
            data: {
                name,
                location,
                openingHours,
                description,
                userId
            }
        });

        res.status(201).json({ message: 'Restaurante criado com sucesso!', restaurant });
    } catch (error) {
        res.status(400).json({ error: 'Falha na criação do restaurante!', details: error.message });
    }
};

const getRestaurants = async (req, res) => {
    try {
        const restaurants = await prisma.restaurant.findMany();
        res.status(200).json(restaurants);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar restaurantes', details: error.message });
    }
};

const getRestaurantById = async (req, res) => {
    const { id } = req.params;

    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: Number(id) },
            include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true
                    }
                },
                accessibleUsers: {
                    include: {
                        user: {
                            select: {
                                id: true,
                                name: true,
                                email: true
                            }
                        }
                    }
                }
            }
        });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurante não encontrado' });
        }

        res.status(200).json(restaurant);
    } catch (error) {
        res.status(500).json({ error: 'Falha ao buscar restaurante', details: error.message });
    }
};

const updateRestaurant = async (req, res) => {
    const { id } = req.params;
    const { name, location, openingHours, description } = req.body;

    try {
        const updatedRestaurant = await prisma.restaurant.update({
            where: { id: Number(id) },
            data: { name, location, openingHours, description }
        });

        res.status(200).json({ message: 'Restaurante atualizado com sucesso!', updatedRestaurant });
    } catch (error) {
        res.status(400).json({ error: 'Falha ao atualizar restaurante', details: error.message });
    }
};

const deleteRestaurant = async (req, res) => {
    const { id } = req.params;
    const userId = req.userId; 

    try {
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: Number(id) }
        });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurante não encontrado!' });
        }

        if (restaurant.userId !== userId) {
            return res.status(403).json({ error: 'Você não tem permissão para deletar este restaurante!' });
        }

        await prisma.restaurant.delete({
            where: { id: Number(id) }
        });

        res.status(200).json({ message: 'Restaurante deletado com sucesso!' });
    } catch (error) {
        res.status(400).json({ error: 'Falha ao deletar restaurante!', details: error.message });
    }
};

const shareRestaurant = async (req, res) => {
    const { restaurantId, userId, role } = req.body;

    try {
        const sharedRestaurant = await prisma.userRestaurant.create({
            data: {
                restaurantId: parseInt(restaurantId),
                userId: parseInt(userId),
                role: role || 'editor', 
            }
        });

        res.status(200).json({ message: 'Restaurante compartilhado com sucesso!', sharedRestaurant });
    } catch (error) {
        res.status(400).json({ error: 'Falha ao compartilhar restaurante!', details: error.message });
    }
};

module.exports = {
    createRestaurant,
    getRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
    shareRestaurant,
};
