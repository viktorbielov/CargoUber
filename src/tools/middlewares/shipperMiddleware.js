const shipperMiddleware = async (req, res, next) => {
    if (req.user.role === 'SHIPPER') {
        next();
    } else {
        res.status(403).json({"message": "Access denied. You are not a shipper!"});
    }
}

module.exports = {shipperMiddleware};