const express = require('express')
const router = express.Router()
const Student = require('../models/student')
const Appointment = require('../models/appointment')

// All Students Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const students = await Student.find(searchOptions)
        res.render('students/index', {
            students: students,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Student Route
router.get('/new', (req, res) => {
    res.render('students/new', { student: new Student() })
})

// Create Student Route
router.post('/', async (req, res) => {
    const student = new Student({
        name: req.body.name
    })
    try {
        const newStudent = await student.save()
        res.redirect(`students/${newStudent.id}`)
    } catch {
        res.render('students/new', {
            student: student,
            errorMessage: 'Error creating Student'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
        const appointments = await Appointment.find({ student: student.id }).limit(6).exec()
        res.render('students/show', {
            student: student,
            appointmentsByStudent: appointments
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id)
        res.render('students/edit', { student: student })
    } catch {
        res.redirect('/students')
    }
})

router.put('/:id', async (req, res) => {
    let student
    try {
        student = await Student.findById(req.params.id)
        student.name = req.body.name
        await student.save()
        res.redirect(`/students/${student.id}`)
    } catch {
        if (student == null) {
            res.redirect('/')
        } else {
            res.render('students/edit', {
                student: student,
                errorMessage: 'Error updating Student'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let student
    try {
        student = await Student.findById(req.params.id)
        await student.remove()
        res.redirect('/students')
    } catch {
        if (student == null) {
            res.redirect('/')
        } else {
            res.redirect(`/students/${student.id}`)
        }
    }
})

module.exports = router 
