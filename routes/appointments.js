const express = require('express')
const router = express.Router()
const Appointment = require('../models/appointment')

const Building = require('../models/building')
const Student = require('../models/student')
const imageMimeTypes = ['image/jpeg', 'image/png', 'images/gif']

// All Appointments Route
router.get('/', async (req, res) => {
    let query = Appointment.find()
    if (req.query.appID != null && req.query.appID != '') {
        query = query.regex('appID', new RegExp(req.query.appID, 'i'))
    }
    if (req.query.firstdate != null && req.query.firstdate != '') {
        query = query.lte('appdate', req.query.firstdate)
    }
    if (req.query.seconddate != null && req.query.seconddate != '') {
        query = query.gte('appdate', req.query.seconddate)
    }
    try {
        const appointments = await query.exec()
        res.render('appointments/index', {
            appointments: appointments,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Appointment Route
router.get('/new', async (req, res) => {
    renderNewPage(res, new Appointment())
})

// Create Appointment Route
router.post('/', async (req, res) => {
    const appointment = new Appointment({
        appID: req.body.appID,
        building: req.body.building,
        student: req.body.student,
        appdate: new Date(req.body.appdate),
        appnum: req.body.appnum,
        description: req.body.description
    })


    try {
        const newAppointment = await appointment.save()
        res.redirect(`appointments/${newAppointment.id}`)
    } catch {
        renderNewPage(res, appointment, true)
    }
})

// Show Appointment Route
router.get('/:id', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
            .populate('building')
            .exec()
        res.render('appointments/show', { appointment: appointment })
    } catch {
        res.redirect('/')
    }
})

// Edit Appointment Route
router.get('/:id/edit', async (req, res) => {
    try {
        const appointment = await Appointment.findById(req.params.id)
        renderEditPage(res, appointment)
    } catch {
        res.redirect('/')
    }
})

// Update Appointment Route
router.put('/:id', async (req, res) => {
    let appointment

    try {
        appointment = await Appointment.findById(req.params.id)
        appointment.appID = req.body.appID
        appointment.building = req.body.building
        appointment.student = req.body.student
        appointment.appdate = new Date(req.body.appdate)
        appointment.appnum = req.body.appnum
        appointment.description = req.body.description

        await appointment.save()
        res.redirect(`/appointments/${appointment.id}`)
    } catch {
        if (appointment != null) {
            renderEditPage(res, appointment, true)
        } else {
            redirect('/')
        }
    }
})

// Delete Appointment Page
router.delete('/:id', async (req, res) => {
    let appointment
    try {
        appointment = await Appointment.findById(req.params.id)
        await appointment.remove()
        res.redirect('/appointments')
    } catch {
        if (appointment != null) {
            res.render('appointments/show', {
                appointment: appointment,
                errorMessage: 'Could not remove appointment '
            })
        } else {
            res.redirect('/')
        }
    }
})

async function renderNewPage(res, appointment, hasError = false) {
    renderFormPage(res, appointment, 'new', hasError)
}

async function renderEditPage(res, appointment, hasError = false) {
    renderFormPage(res, appointment, 'edit', hasError)
}

async function renderFormPage(res, appointment, form, hasError = false) {
    try {
        const buildings = await Building.find({})
        const students = await Student.find({})
        const params = {
            buildings: buildings,
            students: students,
            appointment: appointment
        }
        if (hasError) {
            if (form === 'edit') {
                params.errorMessage = 'Error Updating Appointment'
            } else {
                params.errorMessage = 'Error Creating Appointment'
            }
        }
        res.render(`appointments/${form}`, params)
    } catch {
        res.redirect('/appointments')
    }



}

module.exports = router
