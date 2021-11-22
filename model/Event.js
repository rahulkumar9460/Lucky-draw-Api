const { array } = require('@hapi/joi');
const mongoose = require('mongoose');

const eventSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        min: 2
    },
    activeDate: {
        type: Date,
    },
    closeDate: {
        type : Date,
    },
    reward: {
        type: String,
    },
    participants: {
        type : Array,
    },
    winner : {
        type : Object
    }
});

module.exports = mongoose.model('Event', eventSchema);