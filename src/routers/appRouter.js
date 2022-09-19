const express = require('express');

const router = express.Router();

const {
    renderHomePage,
    login,
    signUp,
    logout,
    createTruck,
    assignTruck,
    deleteTruck,
    createLoad,
    deleteLoad,
    postLoad,
    iterateLoad,
    exportLoads,
    uploadAvatar
} = require('../controllers/appController');

const {upload} = require('../tools/middlewares/multerMiddleware');

router.get('/', renderHomePage);

router.post('/login', login);

router.post('/sign-up', signUp);

router.get('/logout', logout);

router.post('/create-truck', createTruck);

router.post('/assign/:id', assignTruck);

router.post('/delete/:id', deleteTruck);

router.post('/create-load', createLoad);

router.post('/delete-load/:id', deleteLoad);

router.post('/post-load/:id', postLoad);

router.post('/iterate', iterateLoad);

router.get('/export', exportLoads);

router.post('/avatar', upload.single('avatar'), uploadAvatar);

module.exports = {
    appRouter: router
};