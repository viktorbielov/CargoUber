const mongoose = require('mongoose');

const load = mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        enum: ['NEW', 'POSTED', 'ASSIGNED', 'SHIPPED'],
        required: true,
        default: 'NEW'
    },
    state: {
        type: String,
        enum: ['En route to Pick Up', 'Arrived to Pick Up', 'En route to delivery', 'Arrived to delivery']
    },
    name: {
        type: String,
        required: true
    },
    payload: {
        type: Number,
        required: true
    },
    pickup_address: {
        type: String,
        required: true
    },
    delivery_address: {
        type: String,
        required: true
    },
    dimensions: {
        width: {
            type: Number,
            required: true
        },
        length: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    },
    logs: [{
        message: {
            type: String
        },
        time: {
            type: String
        }
    }]
}, {
    timestamps: {
        createdAt: "created_date",
        updatedAt: "updated_date"
    }
});

const Load = mongoose.model('loads', load);

module.exports = {Load};