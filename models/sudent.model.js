
const mongoose = require('mongoose')

const studentSchema = mongoose.Schema({
        name: {
            type: String,
            required: true
        },

        gender: {
            type: String,
            required: true
        },

        weightCategory: {
            type: String,
            required: true
        },

        ageCategory: {
            type: String,
            required: true
        },

        club: {
            type: String,
            required: true
        }

})

module.exports = mongoose.model('Student', studentSchema)