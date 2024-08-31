const express = require('express');
const categoryController = require('../controllers/categoryController');
const verifyUserPermissionForRestaurant = require('../middleware/verifyUserPermissionForRestaurant');
const router = express.Router();

// Aplicar middleware de permissão antes de criar categorias
router.post('/:restaurantId/category', verifyUserPermissionForRestaurant, categoryController.createCategory);

// Aplicar middleware de permissão antes de atualizar categorias
router.put('/:restaurantId/category/:categoryId', verifyUserPermissionForRestaurant, categoryController.updateCategory);

// Aplicar middleware de permissão antes de excluir categorias
router.delete('/:restaurantId/category/:categoryId', verifyUserPermissionForRestaurant, categoryController.deleteCategory);

module.exports = router;
