const express = require('express');

const fileUpload = require('express-fileupload');

const router = express.Router();

const {authMiddleware} = require('../tools/middlewares/authMiddleware');

const {
    getAccountInfo,
    changePassword,
    deleteAccount,
    uploadAvatar,
    deleteAvatar,
    getAvatar
} = require('../controllers/usersController')

router.get('/me', authMiddleware, getAccountInfo);

router.patch('/me/password', authMiddleware, changePassword);

router.delete('/me', authMiddleware, deleteAccount);

router.patch('/avatar', authMiddleware, uploadAvatar);

router.delete('/avatar', authMiddleware, deleteAvatar);

router.get('/avatar', authMiddleware, fileUpload({
    limits: {fileSize: 50 * 1024 * 1024},
}), getAvatar)

module.exports = {
    usersRouter: router
};