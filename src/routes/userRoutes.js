

const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');


router.post('/register', userController.register);
router.post('/login', userController.login);
router.get('/', userController.getUsers);
router.put('/:id', userController.updateUser);
router.get('/:id', userController.getUserById);
router.put('/:id/deactivate', userController.deactivateUser);
router.patch('/:id/deactivate', userController.deactivateUser);

module.exports = router;
