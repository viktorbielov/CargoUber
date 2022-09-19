const express = require('express');

const router = express.Router();

const {signUp, logIn, forgotPassword} = require('../controllers/authController');

router.post('/register', signUp);

router.post('/login', logIn);

router.post('/forgot_password', forgotPassword);

module.exports = {
    authRouter: router
};