const express = require('express')
const router = express.Router()
const Building = require('../models/building')
const Appointment = require('../models/appointment')

// All Buildings Route
router.get('/', async (req, res) => {
    let searchOptions = {}
    if (req.query.name != null && req.query.name !== '') {
        searchOptions.name = new RegExp(req.query.name, 'i')
    }
    try {
        const buildings = await Building.find(searchOptions)
        res.render('buildings/index', {
            buildings: buildings,
            searchOptions: req.query
        })
    } catch {
        res.redirect('/')
    }
})

// New Building Route
router.get('/new', (req, res) => {
    res.render('buildings/new', { building: new Building() })
})

// Create Building Route
router.post('/', async (req, res) => {
    const building = new Building({
        name: req.body.name
    })
    try {
        const newBuilding = await building.save()
        res.redirect(`buildings/${newBuilding.id}`)
    } catch {
        res.render('buildings/new', {
            building: building,
            errorMessage: 'Error creating Building'
        })
    }
})

router.get('/:id', async (req, res) => {
    try {
        const building = await Building.findById(req.params.id)
        const appointments = await Appointment.find({ building: building.id }).limit(6).exec()
        res.render('buildings/show', {
            building: building,
            appointmentsByBuilding: appointments
        })
    } catch {
        res.redirect('/')
    }
})

router.get('/:id/edit', async (req, res) => {
    try {
        const building = await Building.findById(req.params.id)
        res.render('buildings/edit', { building: building })
    } catch {
        res.redirect('/buildings')
    }
})

router.put('/:id', async (req, res) => {
    let building
    try {
        building = await Building.findById(req.params.id)
        building.name = req.body.name
        await building.save()
        res.redirect(`/buildings/${building.id}`)
    } catch {
        if (building == null) {
            res.redirect('/')
        } else {
            res.render('buildings/edit', {
                building: building,
                errorMessage: 'Error updating Building'
            })
        }
    }
})

router.delete('/:id', async (req, res) => {
    let building
    try {
        building = await Building.findById(req.params.id)
        await building.remove()
        res.redirect('/buildings')
    } catch {
        if (building == null) {
            res.redirect('/')
        } else {
            res.redirect(`/buildings/${building.id}`)
        }
    }
})

module.exports = router