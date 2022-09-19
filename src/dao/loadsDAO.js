const {Load} = require('../models/Load');

const states = ['En route to Pick Up', 'Arrived to Pick Up', 'En route to delivery', 'Arrived to delivery']

const insertLoad = async (created_by, name, payload, pickup_address, delivery_address, dimensions) => {
    const load = new Load({
        created_by,
        name,
        payload,
        pickup_address,
        delivery_address,
        dimensions
    });
    await load.save();
}

const getShipperLoads = async (userId,
                               status = {
                                   $in: [
                                       "NEW",
                                       "POSTED",
                                       "ASSIGNED",
                                       "SHIPPED",
                                   ]
                               }, limit, offset) => {
    return (await Load.find({
        "assigned_by": userId,
        status
    }).skip(offset).limit(limit));
}

const getDriverLoads = async (userId,
                              status = {
                                  $in: [
                                      "NEW",
                                      "POSTED",
                                      "ASSIGNED",
                                      "SHIPPED",
                                  ]
                              }, limit, offset) => {
    return (await Load.find({
        "assigned_to": userId,
        status
    }).skip(offset).limit(limit));
}

const assign = async(assignId, load) => {
    load.status = "ASSIGNED";
    load.assigned_to = assignId;
    load.state = "En route to Pick Up";
    load.logs = [{
        "message": `Load assigned to driver with id ${assignId}`,
        "time": new Date()
    }];
    await load.save();
}

const appendLogs = async (load, logsText) => {
    load.logs.push({
        "message": logsText,
        "time": new Date()
    });
    await load.save();
}

const getLoadById = async (loadId) => {
    return (await Load.findOne({
        "_id": loadId
    }));
}

const getActiveLoad = async (driverId) => {
    const load = await Load.findOne({
        "assigned_to": driverId,
        "status": "ASSIGNED"
    });
    if (!load) {
        throw new Error("No active load at current moment");
    }
    return load;
}

const shipperLoadInfo = async (loadId, userId) => {
    return (await Load.findOne({
        "_id": loadId,
        "created_by": userId
    }))
}

const driverLoadInfo = async (loadId, userId) => {
    return (await Load.findOne({
        "_id": loadId,
        "assigned_to": userId
    }))
}

const nextState = async (driverId) => {
    const load = await getActiveLoad(driverId);
    if (load.state === "Arrived to delivery") {
        throw new Error("Cannot edit finished deliveries");
    }
    load.state = states[states.findIndex(element => element === load.state) + 1];
    if (load.state === "Arrived to delivery") {
        load.status = "SHIPPED";
    }
    await appendLogs(load, `Load state changed to '${load.state}'`);
    return load.state;
}

const updateLoadInfo = async (id, update) => {
    await Load.findOneAndUpdate({
        "_id": id,
        "status": "NEW"
    }, update);
}

const deleteLoadData = async (id) => {
    await Load.findOneAndDelete({
        "_id": id,
        "status": "NEW"
    });
}

module.exports = {
    insertLoad,
    getShipperLoads,
    getDriverLoads,
    getActiveLoad,
    getLoadById,
    assign,
    shipperLoadInfo,
    driverLoadInfo,
    nextState,
    updateLoadInfo,
    deleteLoadData,
    appendLogs
}