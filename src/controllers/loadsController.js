const {
    insertLoad,
    getShipperLoads,
    getDriverLoads,
    getLoadById,
    assign,
    getActiveLoad,
    shipperLoadInfo,
    driverLoadInfo,
    nextState,
    updateLoadInfo,
    deleteLoadData,
    appendLogs
} = require('../dao/loadsDAO');

const {
    postTruck,
    statusChange,
    getAssignedTruck
} = require('../dao/trucksDAO');

const createLoad = async (req, res, next) => {
    try {
        const {name, payload, pickup_address, delivery_address, dimensions} = req.body;
        const {userId} = req.user;
        await insertLoad(userId, name, payload, pickup_address, delivery_address, dimensions);
        res.status(200).json({"message": "Load created successfully"});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const getLoads = async (req, res, next) => {
    try {
        const {status, limit, offset} = req.params;
        const {userId, role} = req.user;
        const loads = role === 'SHIPPER' ? await getShipperLoads(userId, status, limit, offset)
            : await getDriverLoads(userId, status, limit, offset);
        res.status(200).json({loads});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const postLoad = async (req, res, next) => {
    try {
        const {id} = req.params;
        const load = await getLoadById(id);
        const truck = await postTruck(load);
        if (truck) {
            await assign(truck.assigned_to, load);
            await statusChange(truck.assigned_to, truck);
            return res.status(200).json({
                "message": "Load posted successfully",
                "driver_found": true
            })
        }
        return res.status(404).json({
            "message": "At this moment there is no driver for your request"
        });
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const activeLoad = async (req, res, next) => {
    try {
        const {userId} = req.user;
        console.log(userId)
        const load = await getActiveLoad(userId);
        res.status(200).json({load});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const getLoad = async (req, res, next) => {
    try {
        const {userId, role} = req.user;
        const {id} = req.params;
        const load = role === "SHIPPER" ? await shipperLoadInfo(id, userId)
            : await driverLoadInfo(id, userId);
        res.status(200).json(load);
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const iterateLoad = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const state = await nextState(userId);
        if (state === "Arrived to delivery") {
            await statusChange(userId);
        }
        res.status(200).json({"message": `Load state changed to '${state}'`});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const updateLoad = async (req, res, next) => {
    try {
        const {id} = req.params;
        const {name, payload, pickup_address, dilevery_address, dimensions} = req.body;
        await updateLoadInfo(id,
            {name, payload, pickup_address, dilevery_address, dimensions});
        res.status(200).json({"message": "Load details changed successfully"});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const deleteLoad = async (req, res, next) => {
    try {
        const {id} = req.params;
        await deleteLoadData(id);
        res.status(200).json({"message": "Load deleted successfully"});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const shippingInfo = async (req, res, next) => {
    try {
        const {id} = req.params;
        const load = await getLoadById(id);
        let truck;
        if (load.assigned_to) {
            truck = await getAssignedTruck(load.assigned_to);
        }
        res.status(200).json({load, truck});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

module.exports = {
    createLoad,
    getLoads,
    postLoad,
    activeLoad,
    getLoad,
    iterateLoad,
    updateLoad,
    deleteLoad,
    shippingInfo
}