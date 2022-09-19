const bcrypt = require('bcryptjs');
const uuid = require('uuid');
const path = require('path');
const fs = require('fs');

const {getUser, updatePassword, deleteUser, updateAvatar, deleteAvatarData, getAvatarData} = require('../dao/usersDAO');

const getAccountInfo = async (req, res, next) => {
    try {
        const {email} = req.user;
        const {_id, role, createdAt} = await getUser(email);
        res.status(200).send({
            _id,
            role,
            email,
            createdDate: createdAt
        });
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const changePassword = async (req, res, next) => {
    try {
        const {oldPassword, newPassword} = req.body;
        const {email} = req.user;
        const {password} = await getUser(email);

        if (await bcrypt.compare(oldPassword, password)) {
            await updatePassword(email, newPassword);
            return res.status(200).json({"message": "Password changed successfully"});
        }
        return res.status(401).json({"message": "Wrong old password"});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const deleteAccount = async (req, res, next) => {
    try {
        const {userId} = req.user;
        await deleteUser(userId);
        res.status(200).json({"message": "Profile deleted successfully"});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const uploadAvatar = async (req, res, next) => {
    try {
        const {avatarName} = req.body;
        const {userId} = req.user;
        await updateAvatar(userId, avatarName);
        res.status(200).json({"message": "Avatar uploaded successfully"});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const deleteAvatar = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const avatarName = await deleteAvatarData(userId);
        fs.unlinkSync(path.resolve('public/images') + '\\' + avatarName);
        res.status(200).json({"message": "Avatar deleted successfully"});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

const getAvatar = async (req, res, next) => {
    try {
        const {userId} = req.user;
        const avatar = await getAvatarData(userId);
        res.status(200).json({avatar});
    } catch (err) {
        res.status(400).json({"message": err.message});
    }
}

module.exports = {getAccountInfo, changePassword, deleteAccount, uploadAvatar, deleteAvatar, getAvatar};