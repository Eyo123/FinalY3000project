if (process.env.NODE_ENV !== 'production') {
  require('dotenv').load()
}
var express = require('express');
var router = express.Router();
var mongo = require('mongodb').MongoClient;
var objectId = require('mongodb').ObjectID;
var assert = require('assert');

var url= 'mongodb+srv://Mop:REAL123456789@cluster0.xucpe.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const app = express()
const expressLayouts = require('express-ejs-layouts')
const bodyParser = require('body-parser')
const methodOverride = require('method-override')

const indexRouter = require('./routes/index')
const buildingRouter = require('./routes/buildings')
const studentRouter = require('./routes/students')
const appointmentRouter = require('./routes/appointments')



app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout', 'layouts/layout')
app.use(expressLayouts)
app.use(methodOverride('_method'))
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect(url, { useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', () => console.log('Connected to Mongoose'))

app.use('/', indexRouter)
app.use('/appointments', appointmentRouter)
app.use('/buildings', buildingRouter)
app.use('/students', studentRouter)



app.listen(process.env.PORT || 3000) 
