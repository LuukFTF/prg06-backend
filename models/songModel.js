const mongoose = require("mongoose");

let Schema = mongoose.Schema;

let Song = new Schema(
    {
        title: {type: String},
        author: {type: String}
    }
)

module.exports = mongoose.model('Songs', songModel);