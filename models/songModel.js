const mongoose = require("mongoose");
const Schema = mongoose.Schema;

// Song Model
const Song = new Schema({
    title: {
        type: String,
        required: true
    },
    author: {
        type: String,
        required: true
    },
    inRepertoireSince: {
        type: String
    },
    dateCreated: {
        type: Date,
        required: true,
        default: Date.now
    }
})


// Export Module
module.exports = mongoose.model('Songs', Song)