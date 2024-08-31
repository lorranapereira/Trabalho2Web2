// userController.js

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

require('dotenv').config();

const register = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword
            }
        });

        res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser });
    } catch (error) {
        res.status(400).json({ error: 'Falha ao registrar usuário!', details: error.message });
    }
};

const login = async (req, res) => {
    console.log('Tentativa de login recebida:', req.body);

    const { email, password } = req.body;

    try {
        const user = await prisma.user.findUnique({ where: { email } });
        console.log('Usuário encontrado:', user);

        if (!user || !(await bcrypt.compare(password, user.password))) {
            console.log('Credenciais inválidas!');
            return res.status(401).json({ error: 'Credenciais inválidas!' });
        }

        const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, { expiresIn: '1h' });
        console.log('Token gerado:', token);

        res.status(200).json({ message: 'Login realizado com sucesso!', token });
    } catch (error) {
        console.error('Erro no login:', error.message);
        res.status(400).json({ error: 'Falha no login!', details: error.message });
    }
};

const getUsers = async (req, res) => {
    try {
        const users = await prisma.user.findMany({
            select: {
                id: true,
                name: true,
                email: true
            }
        });

        res.status(200).json(users);
    } catch (error) {
        res.status(400).json({ error: 'Falha ao buscar usuários!', details: error.message });
    }
};

const updateUser = async (req, res) => {
    const { id } = req.params;
    const { name, email } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { name, email }
        });

        res.status(200).json({ message: 'Usuário atualizado com sucesso!', updatedUser });
    } catch (error) {
        res.status(400).json({ error: 'Falha ao atualizar usuário!', details: error.message });
    }
};

const getUserById = async (req, res) => {
    const { id } = req.params;

    try {
        const user = await prisma.user.findUnique({
            where: { id: parseInt(id) },
            select: { id: true, name: true, email: true, isActive: true }
        });

        if (!user) {
            return res.status(404).json({ error: 'Usuário não encontrado!' });
        }

        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ error: 'Falha ao buscar usuário!', details: error.message });
    }
};

const deactivateUser = async (req, res) => {
    const { id } = req.params;

    try {
        const deactivatedUser = await prisma.user.update({
            where: { id: parseInt(id) },
            data: { isActive: false }
        });

        res.status(200).json({ message: 'Usuário desativado com sucesso!', deactivatedUser });
    } catch (error) {
        res.status(400).json({ error: 'Falha ao desativar usuário!', details: error.message });
    }
};

module.exports = { register, login, getUsers, updateUser, getUserById, deactivateUser };
