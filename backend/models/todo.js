const mongoose = require('mongoose')

const todoSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    content: {
        type: String, 
        required: true
    },
    isCompleted: {
        type: Boolean,
        default: false,
        required: true
    },
    creator: { 
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
})

module.exports = mongoose.model('Todo', todoSchema)