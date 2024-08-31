// src/middleware/verifyUserPermissionForRestaurant.js

const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const verifyUserPermissionForRestaurant = async (req, res, next) => {
    const userId = req.userId; // O userId deve vir do token JWT decodificado
    const { restaurantId } = req.params; // O ID do restaurante vem dos parâmetros da URL

    try {
        // Verificar se o restaurante existe
        const restaurant = await prisma.restaurant.findUnique({
            where: { id: Number(restaurantId) },
            select: { userId: true } // Seleciona apenas o userId do criador
        });

        if (!restaurant) {
            return res.status(404).json({ error: 'Restaurante não encontrado' });
        }

        // Permitir se o usuário for o criador do restaurante
        if (restaurant.userId === userId) {
            return next();
        }

        // Verificar se o usuário tem permissão de edição
        const hasPermission = await prisma.userRestaurant.findFirst({
            where: {
                restaurantId: Number(restaurantId),
                userId: userId,
                role: 'editor' // Verifica se o usuário tem a função de editor
            }
        });

        if (hasPermission) {
            // O usuário tem permissão de editor, permite a criação do produto/categoria
            return next();
        }

        // Caso contrário, não permite a criação do produto/categoria
        return res.status(403).json({ error: 'Você não tem permissão para criar produtos ou categorias para este restaurante' });
    } catch (error) {
        return res.status(500).json({ error: 'Falha ao verificar permissões', details: error.message });
    }
};

module.exports = verifyUserPermissionForRestaurant;
