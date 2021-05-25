const mongoose = require('mongoose')
const Appointment = require('./appointment')

const studentSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    }
})

studentSchema.pre('remove', function(next) {
    Appointment.find({ student: this.id }, (err, appointments) => {
        if (err) {
            next(err)
        } else if (appointments.length > 0) {
            next(new Error('This student has been removed'))
        } else {
            next()
        }
    })
})

module.exports = mongoose.model('Student', studentSchema)