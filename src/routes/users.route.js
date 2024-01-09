const express = require('express')
const router = express.Router();

const userController = require('../controllers/user.controller');
const authMiddleware = require("../middleware/verify")


router.post('/signup', userController.createUser);
router.post('/login',userController.loginUser);
router.get('/users/:id', userController.getUserById);
router.get('/users', userController.getAllUsers);
router.put('/update/:id',authMiddleware, userController.updateUser);
router.delete('/delete/:id', userController.deleteUser);


module.exports = router  ;