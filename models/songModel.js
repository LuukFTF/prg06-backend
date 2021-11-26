const mongoose = require("mongoose");

const songSchema = new mongoose.Schema({
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

module.exports = mongoose.model('Song', songSchema)


// let Schema = mongoose.Schema;

// let Song = new Schema(
//     {
//         title: {type: String},
//         author: {type: String}
//     }
// )

// module.exports = mongoose.model('Songs', songModel);