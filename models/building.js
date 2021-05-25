const mongoose = require('mongoose')
const Appointment = require('./appointment')

const buildingSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

buildingSchema.pre('remove', function(next) {
    Appointment.find({ building: this.id }, (err, appointments) => {
        if (err) {
            next(err)
        } else if (appointments.length > 0) {
            next(new Error('This building has been removed'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Building', buildingSchema)