require('dotenv').config()

const { notEqual } = require('assert');
const express = require('express');
const router = express.Router();
const Song = require('../models/songModel');

console.log("test")

// Song Routes
router

// Songs Collection View
.get('/', checkAcceptType, async (req, res) => {
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
            }

            songsCollection.items.push(songItem)
        }

        res.status(200).json(songsCollection)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Song Detail View
.get('/:id', checkAcceptType, getSongANDaddLinksToSong, (req, res) => {
    try {
        res.status(200).json(res.song)
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})



// New Song
.post('/', checkContentType, checkAcceptType, async (req, res) => {

    const song = new Song({
        title: req.body.title,
        author: req.body.author,
        inRepertoireSince: req.body.inRepertoireSince,
    })

    try {
        let newSong = await song.save();

        try {
            newSong = newSong.toJSON()
    
            newSong = {
                ...newSong,
                "_links": {
                    "self": { "href": "http://" + req.headers.host + "/songs/" + newSong._id },
                    "collection": { "href": "http://" + req.headers.host + "/songs/" }
                }
            }
        } catch (err) {
            return res.status(500).json({ message: err.message})
        }

        res.status(201).json(newSong);
    } catch (err) {
        console.log("client error httpurl")
        res.status(400).json({ message: err.message})
    }
})

// Update Song
.put('/:id', checkContentType, checkAcceptType, getSong, async (req, res) => {
    if (req.body.title != null) {
        res.song.title = req.body.title
    }
    if (req.body.author != null) {
        res.song.author = req.body.author
    }
    if (req.body.inRepertoireSince != null) {
        res.song.inRepertoireSince = req.body.inRepertoireSince
    }

    try {
        let updatedSong = await res.song.save()

        try {
            updatedSong = updatedSong.toJSON()
    
            updatedSong = {
                ...updatedSong,
                "_links": {
                    "self": { "href": "http://" + req.headers.host + "/songs/" + updatedSong._id },
                    "collection": { "href": "http://" + req.headers.host + "/songs/" }
                }
            }
        } catch (err) {
            return res.status(500).json({ message: err.message})
        }

        res.status(200).json(updatedSong)
    } catch (err) {
        res.status(400).json({ message: err.message })
    }
})

// Delete Song
.delete('/:id', checkAcceptType, getSong, async (req, res) => {
    try {
        await res.song.remove()
        res.status(204).json({ message: 'Successfully Deleted Song'})
    } catch (err) {
        res.status(500).json({ message: err.message})
    }
})

// Options

.options('/', checkAcceptType, (req, res) => {
    try {
        res.header("Allow", "GET, POST, OPTIONS")
        res.status(200).json(["GET", "POST", "OPTIONS"])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
})

// Song Detail View
.options('/:id', checkAcceptType, (req, res) => {
    try {
        res.header("Allow", "GET, PUT, DELETE, OPTIONS")
        res.status(200).json(["GET", "PUT", "DELETE", "OPTIONS"])
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
});



// Functions

// Check Content Type Function
async function checkContentType(req, res, next) {
    try {
        let contentType = req.get("Content-Type")

        if (contentType == "application/json" || contentType == "application/x-www-form-urlencoded") {
            next()
        } else {
            res.status(415).json({ message: "'Content-Type: " + contentType + "' not allowed, only allowed 'Content-Type: application/json'" })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}



// Check Accept Type Function
async function checkAcceptType(req, res, next) {
    try {
        let acceptType = req.get("Accept")

        if (req.method === 'POST' || acceptType == "application/json" || acceptType == "application/x-www-form-urlencoded") {
            next()
        } else {
            console.log("accept type client error")
            res.status(415).json({ message: "'Accept: " + acceptType + "' not allowed, only allowed 'Accept: application/json'" })
        }
    } catch (err) {
        res.status(500).json({ message: err.message })
    }
}


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

async function getSongANDaddLinksToSong(req, res, next) {
    let song
    try {
        song = await Song.findById(req.params.id)
        if (song == null) {
            return res.status(404).json({ message: 'Cannot find song'})
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    try {
        song = song.toJSON()

        song = {
            ...song,
            "_links": {
                "self": { "href": "http://" + req.headers.host + "/songs/" + song._id },
                "collection": { "href": "http://" + req.headers.host + "/songs/" }
            }
        }
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }

    res.song = song
    next()
};

// async function addLinksToSong(req, res, next) {
//     try {
//         let song = req.song.toJSON()

//         song = {
//             ...song,
//             "_links": {
//                 "self": { "href": "http://" + req.headers.host + "/songs/" + song._id },
//                 "collection": { "href": "http://" + req.headers.host + "/songs/" }
//             }
//         }

//         res.song = song

//         console.log(song)
//         console.log(res.song)
//         console.log(req.song)

//         next()
//     } catch (err) {
//         return res.status(500).json({ message: err.message})
//     }
// }


// Pagination Functions
function getTotalItems() {
    totalItems = 10

    return totalItems
}

function getCurrentItems(totalItems, start, limit) {
    currentItems = 2

    return currentItems
}

function getCurrentPage(totalItems, start, limit) {
    currentPage = 3

    return currentPage
}

function getTotalPages(start, limit) {
    totalPages = 10

    return totalPages
}


function getFirstPageItem(totalItems, start, limit) {
    firstPageItem = 1

    return firstPageItem
}

function getFirstPageItemQuery(totalItems, start, limit) {

}

function getLastPageItem(totalItems, start, limit) {
    lastPage = 5

    lastPageItem = totalItems - limit + 1

    return lastPageItem
}

function getlastPageItemQuery(totalItems, start, limit) {
    
}

function getPreviousPageItem(totalItems, start, limit) {
    previousPageItem = start - limit 

    return previousPageItem
}

function getPreviousPageItemQuery(totalItems, start, limit) {

}


function getNextPageItem(totalItems, start, limit) {
    nextPageItem = start + limit 

    return nextPageItem
}


function getNextPageItemQuery(totalItems, start, limit) {

}


function getPageNumer(totalItems, start, limit, itemNumber) {

}


function generatePagination(totalItems, start, limit) {
    try {
        pagination = {
            "currentPage": 3,
            "currentItems": getCurrentItems(),
            "totalPages": 5,
            "totalItems": 10,
            "links": {
                "first": {
                    "page": 1,
                    "href": "http://host/items/?start=1&limit=2"
                },
                "last": {
                    "page": 5,
                    "href": "http://host/items/?start=9&limit=2"
                },
                "previous": {
                    "page": 2,
                    "href": "http://host/items/?start=3&limit=2"
                },
                "next": {
                    "page": 4,
                    "href": "http://host/items/?start=7&limit=2"
                }
            }
        }

    } catch (err) {

    }

}

// Export Module
module.exports = router