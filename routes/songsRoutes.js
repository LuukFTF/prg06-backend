const express = require('express');
const router = express.Router();
const Song = require('../models/songModel');

console.log("test")

// Song Routes
router
// Songs Collection View
.get('/', async (req, res) => {
    try {
        const songs = await Song.find()
        res.json(songs)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Song Detail View
.get('/:id', getSong, (req, res) => {
    res.json(res.song)
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
        res.status(200).json({ message: 'Deleted Song'})
    } catch (err) {
        res.status(500).json({ message: err.message})
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