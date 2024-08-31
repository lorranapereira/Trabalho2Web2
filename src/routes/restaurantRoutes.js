

const express = require('express');
const router = express.Router();
const restaurantController = require('../controllers/restaurantController');
const authMiddleware = require('../middleware/authMiddleware');

router.use(authMiddleware);

router.post('/', restaurantController.createRestaurant);
router.get('/', restaurantController.getRestaurants);
router.get('/:id', restaurantController.getRestaurantById);
router.put('/:id', restaurantController.updateRestaurant);
router.delete('/:id', restaurantController.deleteRestaurant);
router.post('/share', restaurantController.shareRestaurant);

module.exports = router;
