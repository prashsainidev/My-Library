const mongoose = require('mongoose')
const Book = require('./book')

const authorSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    isProtected: {
        type: Boolean,
        default: false
    }
})

module.exports = mongoose.model('Author', authorSchema)