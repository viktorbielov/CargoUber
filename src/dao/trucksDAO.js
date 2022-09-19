const {Truck} = require('../models/Truck');

const insertTruck = async (createdBy, assignedTo, status, type, payload, dimensions) => {
    const truck = new Truck({
        "created_by": createdBy,
        "assigned_to": assignedTo,
        status,
        type,
        payload,
        dimensions
    });
    await truck.save();
}

const getUserTrucks = async (userId) => {
    return (await Truck.find({"created_by": userId}));
}

const getUserTruck = async (userId, truckId) => {
    return (await Truck.find({
        "created_by": userId,
        "_id": truckId
    }));
}

const undoAssignUserTruck = async (userId) => {
    await Truck.findOneAndUpdate({
        "assigned_to": userId
    }, {
        $set: {
            "assigned_to": null
        }
    });
}

const assignUserTruck = async (userId, truckId) => {
    return (await Truck.findOneAndUpdate({
        "_id": truckId,
        "created_by": userId
    }, {
        $set: {
            "assigned_to": userId
        }
    }));
}

const updateUserTruck = async (userId, truckId, type) => {
    await Truck.findOneAndUpdate({
        "_id": truckId,
        "created_by": userId
    }, {type});
}

const deleteUserTruck = async (userId, truckId) => {
    await Truck.findOneAndDelete({
        "_id": truckId,
        "created_by": userId
    });
}

const postTruck = async (load) => {
    const {payload, dimensions} = load;
    if (load.assigned_to) {
        throw new Error("Cannot post already assigned load");
    }
    return (await Truck.findOne({
        "assigned_to": {$ne: null},
        "status": 'IS',
        "payload": {$gt: payload},
        "dimensions.length": {$gt: dimensions.length},
        "dimensions.width": {$gt: dimensions.width},
        "dimensions.height": {$gt: dimensions.height}
    }));
}

const statusChange = async (userId, truck) => {
    if (!truck) {
        truck = await getAssignedTruck(userId);
    }
    switch(truck.status) {
        case "IS":
            truck.status = "OL";
            break;
        case "OL":
            truck.status = "IS";
            break;
    }
    await truck.save();
}

const getAssignedTruck = async (userId) => {
    return (await Truck.findOne({
        "assigned_to": userId
    }));
}
module.exports = {
    insertTruck,
    getUserTrucks,
    undoAssignUserTruck,
    assignUserTruck,
    getUserTruck,
    updateUserTruck,
    deleteUserTruck,
    postTruck,
    statusChange,
    getAssignedTruck
};