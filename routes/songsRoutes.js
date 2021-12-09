require('dotenv').config()

const { notEqual } = require('assert');
const express = require('express');
const router = express.Router();
const Song = require('../models/songModel');

console.log("test")

// Song Routes
router

.use('/', (req, res, next) => {
    try {
        console.log("middleware collectie")
        let contentType = req.get("Content-Type")
        console.log("Content-Type: " + contentType)

        if (contentType == "application/json") {
            next()
        } else {
            res.status(400).json({ message: "content type '" + contentType + "' not allowed, only allowed accept: 'application/json'" })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Songs Collection View
.get('/', async (req, res) => {
    try {
        const songs = await Song.find()

        let songsCollection = {
            "items": [],
            "_links": {
                "self": { "href": "http://" + req.headers.host + "/songs/" },
                "collection": { "href": "http://" + req.headers.host + "/songs/" }
            },
            "pagination": { 
                "message": "wip" 
            }
        }

        for(let song of songs) {
            let songItem = song.toJSON()

            songItem._links = {
                "self": { "href": "http://" + req.headers.host + "/songs/" + songItem._id },
                "collection": { "href": "http://" + req.headers.host + "/songs/" }
            },

            songsCollection.items.push(songItem)
        }

        res.json(songsCollection)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Song Detail View
.get('/:id', getSong, (req, res) => {
    try {
        res.json(res.song)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



// New Song
.post('/', async (req, res) => {
    const song = new Song({
        title: req.body.title,
        author: req.body.author,
        inRepertoireSince: req.body.inRepertoireSince,
    })

    try {
        const newSong = await song.save();
        res.status(201).json(newSong);
    } catch (err) {
        res.status(400).json({ message: err.message})
    }
})

// Update Song
.patch('/:id', getSong, async (req, res) => {
    if (req.body.title != null) {
        res.song.title = req.body.title
    }
    if (req.body.author != null) {
        res.song.author = req.body.author
    }
    try {
        const updatedSong = await res.song.save()
        res.json(updatedSong)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Delete Song
.delete('/:id', getSong, async (req, res) => {
    try {
        await res.song.remove()
        res.status(204).json({ message: 'Deleted Song'})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Options

.options('/',  (req, res) => {
    try {
        res.header("Allow", "GET, POST, OPTIONS")
        res.json(["GET", "POST", "OPTIONS"])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Song Detail View
.options('/:id', (req, res) => {
    try {
        res.header("GET, PUT, DELETE, OPTIONS")
        res.json(["GET", "PUT", "DELETE", "OPTIONS"])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});



// Functions

// Song Find Function
async function getSong(req, res, next) {
    let song
    try {
        song = await Song.findById(req.params.id)
        if (song == null) {
            return res.status(404).json({ message: 'Cannot find song'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.song = song
    next()
}

// Export Module
module.exports = router