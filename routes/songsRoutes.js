require('dotenv').config()

const { notEqual } = require('assert');
const express = require('express');
const { start } = require('repl');
const router = express.Router();
const Song = require('../models/songModel');

console.log("test")

// Song Routes
router

.use('/', (req, res, next) => {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "*");
    res.header("Access-Control-Allow-Methods", "Origin, Content-Type, Accept");
    res.header("Access-Control-Allow-Headers", "Origin, Content-Type, Accept");

    console.log("------------------------------------------------")
    console.log(req.method);
    console.log(req.query);

    next()
})

// Songs Collection View
.get('/', checkAcceptType, async (req, res) => {
    try {
        let start = req.query.start
        let limit = req.query.limit
        start = start ? parseInt(start) : 1;
        limit = limit ? parseInt(limit) : totalItems;

        const songs = await Song.find({}, null, {skip: start - 1, limit: limit})

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

        try {
            let totalItems = await Song.estimatedDocumentCount();  
    
            console.log("total items:" + totalItems, "start:" + start, "limit:" + limit)

            if(limit == totalItems) {
                songsCollection = {
                    ...songsCollection,
                    "pagination": {
                        "currentPage": 1,
                        "currentItems": totalItems,
                        "totalPages": 1,
                        "totalItems": totalItems,
                        "links": {
                            "first": {
                                "page": 1,
                                "href": "http://" + req.headers.host + "/songs/"
                            },
                            "last": {
                                "page": 1,
                                "href": "http://" + req.headers.host + "/songs/"
                            },
                            "previous": {
                                "page": 1,
                                "href": "http://" + req.headers.host + "/songs/"
                            },
                            "next": {
                                "page": 1,
                                "href": "http://" + req.headers.host + "/songs/"
                            }
                        }
                    }
                }
            } if(req.query.limit == 1) { 
                songsCollection = {
                    ...songsCollection,
                    "pagination": {
                        "currentPage": 3,
                        "currentItems": 1,
                        "totalPages": 14,
                        "totalItems": 14,
                        "links": {
                            "first": {
                                "page": 1,
                                "href": "http://" + req.headers.host + "/songs/" + "?start=" + 1 + "&limit=" + 1
                            },
                            "last": {
                                "page": 14,
                                "href": "http://" + req.headers.host + "/songs/" + "?start=" + 14 + "&limit=" + 1
                            },
                            "previous": {
                                "page": 2,
                                "href": "http://" + req.headers.host + "/songs/" + "?start=" + 2 + "&limit=" + 1
                            },
                            "next": {
                                "page": 4,
                                "href": "http://" + req.headers.host + "/songs/" + "?start=" + 4 + "&limit=" + 1
                            }
                        }
                    } 
                }
            } else {
                songsCollection = {
                    ...songsCollection,
                    "pagination": generatePagination(totalItems, start, parseInt(limit), req, res)
                }
            }


        } catch {
            res.status(500).json({ message: "pagination could not be build; " + err.message })
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

function getTotalPages(totalItems, start, limit) {
    let totalPages

    if (limit == null) {
        totalPages = 1
    }

    totalPages = Math.ceil(totalItems / limit)

    return totalPages
}

function getCurrentPage(totalItems, start, limit) {
    let currentPage

    if (start == null || limit == null) {
        currentPage = 1
    }

    currentPage = Math.ceil(start / limit)

    return currentPage
}

function getLastPageItem(totalItems, start, limit) {
    let lastPageItem = (totalItems- (start - 1)) % limit;

    return lastPageItem
}

function getLastPageItemQuery(totalItems, start, limit) {
    let lastPageItem = getLastPageItem(totalItems, start, limit)
    let lastPageItemQuery = "?start=" + lastPageItem + "&limit=" + limit

    return lastPageItemQuery
}

function getPreviousPageItem(totalItems, start, limit) {
    let previousPageItem = start - limit 

    return previousPageItem
}

function getPreviousPageItemQuery(totalItems, start, limit) {
    let previousPageItem = getPreviousPageItem(totalItems, start, limit)
    let previousPageItemQuery = "?start=" + previousPageItem + "&limit=" + limit

    return previousPageItemQuery
}


function getNextPageItem(totalItems, start, limit) {
    let nextPageItem = start + limit 

    return nextPageItem
}


function getNextPageItemQuery(totalItems, start, limit) {
    let nextPageItem = getNextPageItem(totalItems, start, limit)
    let nextPageItemQuery = "?start=" + nextPageItem + "&limit=" + limit

    return nextPageItemQuery
}


function getPageNumber(totalItems, start, limit, itemNumber) {
    let pageNumber = Math.ceil(itemNumber / limit)

    console.log("pageNumber: " + pageNumber)
    return pageNumber
}


function generatePagination(totalItems, start, limit, req, res) {
    lastPageItem = getLastPageItem(totalItems, start, limit)
    previousPageItem = getPreviousPageItem(totalItems, start, limit)
    nextPageItem = getNextPageItem(totalItems, start, limit)

    console.log("lastPageItem: " + lastPageItem)
    console.log("previousPageItem: " + previousPageItem)
    console.log("nextPageItem: " + nextPageItem)

    try {
        let pagination = {
            "currentPage": getCurrentPage(totalItems, start, limit),
            "currentItems": limit,
            "totalPages": getTotalPages(totalItems, start, limit),
            "totalItems": totalItems,
            "links": {
                "first": {
                    "page": 1,
                    "href": "http://" + req.headers.host + "/songs/" + "?start=" + 1 + "&limit=" + limit
                },
                "last": {
                    "page": getPageNumber(totalItems, start, limit, lastPageItem),
                    "href": "http://" + req.headers.host + "/songs/" + getLastPageItemQuery()
                },
                "previous": {
                    "page": getPageNumber(totalItems, start, limit, previousPageItem),
                    "href": "http://" + req.headers.host + "/songs/" + getPreviousPageItemQuery()
                },
                "next": {
                    "page": getPageNumber(totalItems, start, limit, nextPageItem),
                    "href": "http://" + req.headers.host + "/songs/" + getNextPageItemQuery()
                }
            }
        }

        return pagination
    } catch (err) {
        return res.status(500).json({ message: err.message})
    }
}

// Export Module
module.exports = router