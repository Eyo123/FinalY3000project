const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    appID: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    appdate: {
        type: Date,
        required: true
    },

    createdAt: {
        type: Date,
        required: true,
        default: Date.now
    },

    building: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Building'
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Student'
    }
})




module.exports = mongoose.model('Appointment', appointmentSchema)