const jwt = require('jsonwebtoken');

const authMiddleware = async (req, res, next) => {
    const {authorization} = req.headers;

    if (!authorization) {
        return res.status(401).json({'message': 'Please provide authorization header'});
    }

    const [, token] = authorization.split(' ');

    if (!token) {
        return res.status(401).json({'message': 'Please include token to request'});
    }

    try {
        const payload = jwt.verify(token, process.env.SECRET_KEY);
        req.user = {
            userId: payload.userId,
            email: payload.email,
            role: payload.role
        };
        next();
    } catch (err) {
        return res.status(401).json({'message': err.message});
    }
}

module.exports = {authMiddleware};