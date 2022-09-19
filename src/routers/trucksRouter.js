const express = require('express');

const router = express.Router();

const {
    createTruck,
    getTrucks,
    getTruck,
    updateTruck,
    deleteTruck,
    assignTruck
} = require('../controllers/trucksController');

const {authMiddleware} = require('../tools/middlewares/authMiddleware');

const {driverMiddleware} = require('../tools/middlewares/driverMiddleware');

router.get('/', authMiddleware, driverMiddleware, getTrucks);

router.post('/', authMiddleware, driverMiddleware, createTruck);

router.get('/:id', authMiddleware, driverMiddleware, getTruck);

router.put('/:id', authMiddleware, driverMiddleware, updateTruck);

router.delete('/:id', authMiddleware, driverMiddleware, deleteTruck);

router.post('/:id/assign', authMiddleware, driverMiddleware, assignTruck)

module.exports = {
    trucksRouter: router
};