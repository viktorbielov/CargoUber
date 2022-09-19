const {
    insertTruck,
    undoAssignUserTruck,
    getUserTrucks,
    getUserTruck,
    updateUserTruck,
    deleteUserTruck,
    assignUserTruck
} = require('../dao/trucksDAO');

const getPayload = (type) => {
    switch (type) {
        case "SPRINTER":
            return 1700;
        case "SMALL STRAIGHT":
            return 2500;
        case "LARGE STRAIGHT":
            return 4000;
    }
}

const getDimensions = (type) => {
    switch (type) {
        case "SPRINTER":
            return {
                length: 300,
                width: 250,
                height: 170
            };
        case "SMALL STRAIGHT":
            return {
                length: 500,
                width: 250,
                height: 170
            };
        case "LARGE STRAIGHT":
            return {
                length: 700,
                width: 350,
                height: 200
            };
    }
}

const createTruck = async (req, res, next) => {
    try {
        const {type} = req.body;
        const {userId} = req.user;
        await undoAssignUserTruck(userId);
        await insertTruck(userId, userId, "IS", type, getPayload(type), getDimensions(type));
        res.status(200).json({"message": "Truck created successfully"});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const getTrucks = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const trucks = await getUserTrucks(userId);
        res.status(200).json({trucks});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const getTruck = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {userId} = req.user;
        const truck = await getUserTruck(userId, id);
        res.status(200).json({truck});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const updateTruck = async (req, res, next) => {
    try {
        const {type} = req.body;
        const {userId} = req.user;
        const {id} = req.params;
        await updateUserTruck(userId, id, type);
        res.status(200).json({"message": "Truck details changed successfully"});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const deleteTruck = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {userId} = req.user;
        await deleteUserTruck(userId, id);
        res.status(200).json({"message": "Truck deleted successfully"})
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const assignTruck = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {userId} = req.user;
        await undoAssignUserTruck(userId);
        await assignUserTruck(userId, id);
        res.status(200).json({"message": "Truck assigned successfully"});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

module.exports = {
    createTruck,
    getTrucks,
    getTruck,
    updateTruck,
    deleteTruck,
    assignTruck
};