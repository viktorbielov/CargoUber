const mongoose = require('mongoose');

const user = mongoose.Schema({
    role: {
        type: String,
        required: true,
        enum: ['SHIPPER', 'DRIVER']
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    avatar: {
        type: String
    }
}, {
    timestamps: {
        createdAt: "created_date",
        updatedAt: "updated_date"
    }
});

const User = mongoose.model('users', user);

module.exports = {User};