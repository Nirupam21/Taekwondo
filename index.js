const express = require('express')
const mongoose = require('mongoose')
const path = require('path')
const ejsLayout = require('express-ejs-layouts')
//const url = 'mongodb://127.0.0.1/students'
const url = "mongodb+srv://nirupam21:nirupam21@cluster0.wdgr9rl.mongodb.net/"

const app = express()

app.use(express.urlencoded({ extended : true }))

app.set("view engine", "ejs")
app.set("views", path.join(path.resolve(), "views"))

app.use(ejsLayout)

mongoose.connect(url)
const con = mongoose.connection

con.on('open', ()=> {
        console.log('connected...')
})

app.use(express.json())

const studentRouter = require("./routes/student.route")
app.use('/', studentRouter)

app.use(express.static('views'))

app.listen(9000, () => {
    console.log('Server Started')
})