const express = require('express');
const productController = require('../controllers/productController');
const verifyUserPermissionForRestaurant = require('../middleware/verifyUserPermissionForRestaurant');
const upload = require('../middleware/uploadMiddleware');
const router = express.Router();

// Aplicar middleware de permissão antes de criar produtos
router.post('/:restaurantId/category/:categoryId/products', verifyUserPermissionForRestaurant, productController.createProduct);

// Aplicar middleware de permissão antes de atualizar produtos
router.put('/:restaurantId/category/:categoryId/products/:productId', verifyUserPermissionForRestaurant, productController.updateProduct);

// Aplicar middleware de permissão antes de excluir produtos
router.delete('/:restaurantId/category/:categoryId/products/:productId', verifyUserPermissionForRestaurant, productController.deleteProduct);

router.get('/:restaurantId/products/:productId', productController.getProductById);
router.get('/:restaurantId/products', productController.getProductsByRestaurant);

// Aplicar middleware de permissão antes de fazer upload de imagens
router.post('/:restaurantId/category/:categoryId/products/:productId/image', verifyUserPermissionForRestaurant, upload.single('image'), productController.uploadProductImage);

module.exports = router;
