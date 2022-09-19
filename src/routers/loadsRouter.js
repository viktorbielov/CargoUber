const express = require('express');

const router = express.Router();

const {
    createLoad,
    getLoads,
    postLoad,
    activeLoad,
    getLoad,
    iterateLoad,
    updateLoad,
    deleteLoad,
    shippingInfo
} = require('../controllers/loadsController');

const {authMiddleware} = require('../tools/middlewares/authMiddleware');

const {shipperMiddleware} = require('../tools/middlewares/shipperMiddleware');

const {driverMiddleware} = require('../tools/middlewares/driverMiddleware');

router.post('/', authMiddleware, createLoad, shipperMiddleware);

router.get('/', authMiddleware, getLoads);

router.post('/:id/post', authMiddleware, shipperMiddleware, postLoad);

router.get('/active', authMiddleware, driverMiddleware, activeLoad);

router.get('/:id', authMiddleware, getLoad);

router.patch('/active/state', authMiddleware, driverMiddleware, iterateLoad);

router.put('/:id', authMiddleware, shipperMiddleware, updateLoad);

router.delete('/:id', authMiddleware, shipperMiddleware, deleteLoad);

router.get('/:id/shipping_info', authMiddleware, shipperMiddleware, shippingInfo);

module.exports = {
    loadsRouter: router
};