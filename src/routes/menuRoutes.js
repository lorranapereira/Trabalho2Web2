const express = require('express');
const menuController = require('../controllers/menuController');
const router = express.Router();

router.post('/:restaurantId/menus', menuController.createMenu); 
router.get('/:restaurantId/menus', menuController.getMenu); 

module.exports = router;
