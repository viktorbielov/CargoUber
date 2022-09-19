const driverMiddleware = (req, res, next) => {
    if (req.user.role === 'DRIVER') {
        next();
    } else {
        res.status(403).json({"message": "Access denied. You are not a driver!"});
    }
}

module.exports = {driverMiddleware};