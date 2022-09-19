const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const {insertUser, getUser, updatePassword} = require('../dao/usersDAO');
const {mail} = require('../tools/nodeMailer');
const passwordGenerator = require('generate-password');

const signUp = async (req, res, next) => {
    try {
        const {role, email, password} = req.body;
        await insertUser(role, email, password);
        res.status(200).json({'message': 'Profile created successfully'});
    } catch (err) {
        res.status(400).json({'message': err.message});
    }
}

const logIn = async (req, res, next) => {
    try {
        const {email, password} = req.body;
        const user = await getUser(email);
        if (await bcrypt.compare(password, user.password)) {
            const payload = {
                userId: user._id,
                email: email,
                role: user.role
            };
            const token = jwt.sign(payload, process.env.SECRET_KEY);
            return res.status(200).json({'jwt_token': token});
        }

        return res.status(403).json({'message': 'Not authorized'});
    } catch (err) {
        res.status(400).json({'message': err.message});
    }
}

const forgotPassword = async (req, res, next) => {
    try {
        const {email} = req.body;
        const password = passwordGenerator.generate({
            length: 10,
            numbers: true
        });
        await updatePassword(email, password);
        mail({
            to: email,
            subject: 'New password',
            text: `Hey! Your new password is: ${password}`
        });
        res.status(200).json({'message': 'New password sent to your email address'});
    } catch (err) {
        res.status(400).json({'message': err.message});
    }
}

module.exports = {signUp, logIn, forgotPassword};