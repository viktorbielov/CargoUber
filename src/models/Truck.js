const mongoose = require('mongoose');

const truck = mongoose.Schema({
    created_by: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    assigned_to: {
        type: mongoose.Schema.Types.ObjectId
    },
    status: {
        type: String,
        enum: ['IS', 'OL'],
        required: true
    },
    type: {
        type: String,
        enum: ['SPRINTER', 'SMALL STRAIGHT', 'LARGE STRAIGHT'],
        required: true
    },
    payload: {
        type: Number,
        required: true
    },
    dimensions: {
        length: {
            type: Number,
            required: true
        },
        width: {
            type: Number,
            required: true
        },
        height: {
            type: Number,
            required: true
        }
    }
}, {
    timestamps: {
        createdAt: "created_date",
        updatedAt: "updated_date"
    }
});

const Truck = mongoose.model('trucks', truck);

module.exports = {Truck};