const {User} = require('../models/User');
const bcrypt = require('bcryptjs');

const insertUser = async (role, email, password) => {
    const user = new User({
        role,
        email,
        password: await bcrypt.hash(password, 10)
    });

    return await user.save();
}

const getUser = async (email) => {
    return (await User.findOne({email}));
}

const updatePassword = async (email, password) => {
    await User.findOneAndUpdate({email},
        {$set: {password: await bcrypt.hash(password, 10)}});
}

const deleteUser = async (_id) => {
    await User.deleteOne({_id});
}

const updateAvatar = async (_id, avatarName) => {
    await User.findOneAndUpdate({
        _id
    }, {
        avatar: avatarName
    });
}

const deleteAvatarData = async (_id) => {
    const user = await User.findOne({
        _id
    });
    const avatarName = user.avatar;
    user.avatar = null;
    await user.save();
    return avatarName;
}

const getAvatarData = async (_id) => {
    const user = await User.findOne(({
        _id
    }));
    return user.avatar;
}

module.exports = {insertUser, getUser, updatePassword, deleteUser, updateAvatar, deleteAvatarData, getAvatarData};