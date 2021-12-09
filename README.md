# prg06-backend (Nodejs API)


## General Design

content
pagination
links

```json
{
    "items": [   
        {
            "id": "5",
            "title": "lorem",
            "body": "lorem",
            "_links": {
                "self": { "href": "http://host/items/5" },
                "collection": { "href": "http://host/songs/" }
            }
        }, 
        { 
            "": "", 
        }   
    ],
    "item": {
            "id": "6",
            "title": "lorem",
            "body": "lorem",
            "_links": {
                "self": { "href": "http://host/items/6" },
                "collection": { "href": "http://host/items/" }
            },   

    "links": {
        "self": "http://host/items/?start=5&limit=2"
    },

    "pagination": {
        "currentPage": 3,
        "currentItems": 2,
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
}
```

## Calls Design

### error

response type: message

```json
HTTP/1.1 200 OK
Content-Type: application/json

{ 
    "message": "error message" 
}
```

### PING

```json
GET /ping
Accept: application/json
```

response type: message

```json
HTTP/1.1 200 OK
Content-Type: application/json

{ 
    "message": "pong!" 
}
```

### SONGS

### GET overview

```json
GET /songs
Accept: application/json
```

response type: collection


```json
HTTP/1.1 200 OK
Content-Type: application/json

{
    "items": [
        {
            "id": "5",
            "title": "Plateau",
            "author": "Meat Puppets",
            "inRepertoireSince": "2021",
            "_links": {
                "self": { "href": "http://host/songs/5" },
                "collection": { "href": "http://host/songs/" }
            }
        },
        {
            "id": "6",
            "title": "Apartment",
            "author": "Young the Giant",
            "inRepertoireSince": "2020",
            "_links": {
                "self": { "href": "http://host/songs/6" },
                "collection": { "href": "http://host/songs/" }
            },
        }
    ],
    "_links": {
        "self": { "href": "http://host/songs/?start=5&limit=2" }
    },
    "pagination": {
        "currentPage": 3,
        "currentItems": 2,
        "totalPages": 5,
        "totalItems": 10,
        "_links": {
            "first": {
                "page": 1,
                "href": "http://host/songs/?start=1&limit=2"
            },
            "last": {
                "page": 5,
                "href": "http://host/songs/?start=9&limit=2"
            },
            "previous": {
                "page": 2,
                "href": "http://host/songs/?start=3&limit=2"
            },
            "next": {
                "page": 4,
                "href": "http://host/songs/?start=7&limit=2"
            }
        }
    }
}
```

### GET detail

```json
GET /songs/:id
Accept: application/json
```

response type: detail

```json
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": "1",
    "title": "Come As You Are",
    "author": "Nirvana",
    "inRepertoireSince": "2019",
    "_links": {
        "self": { "href": "http://host/songs/1" },
        "collection": { "href": "http://host/songs/" }
    }
}
```

### POST

```json
POST /songs
Accept: application/json
Content-Type: application/json

{
    "title": "Plitzkrieg BOB",
    "author": "Ra mon es",
    "inRepertoireSince": "2022",
}
```

response type: detail


```json
HTTP/1.1 201 OK
Content-Type: application/json

{
    "id": "11",
    "title": "Plitzkrieg BOB",
    "author": "Ra mon es",
    "inRepertoireSince": "2022",
    "_links": {
        "self": { "href": "http://host/songs/11" },
        "collection": { "href": "http://host/songs/" }
    }
}
```

### PATCH

```json
POST /songs/:id
Accept: application/json
Content-Type: application/json

{
    "title": "Blitzkrieg Bop",
    "author": "Ramones",
}
```

response type: detail


```json
HTTP/1.1 200 OK
Content-Type: application/json

{
    "id": "11",
    "title": "Blitzkrieg Bop",
    "author": "Ramones",
    "inRepertoireSince": "2022",
    "_links": {
        "self": { "href": "http://host/songs/11" },
        "collection": { "href": "http://host/songs/" }
    }
}
```

### DELETE 

```json
POST /songs/:id
Accept: application/json
Content-Type: application/json

```

response type: message


```json
HTTP/1.1 204 OK
Content-Type: application/json

{
    "message": "song has been succesfully removed" 
}
```


### OPTIONS :id

```json
OPTIONS /songs/:id
Accept: application/json

```

response type: allow methods array


```json
HTTP/1.1 200 OK
Content-Type: application/json
Allow: GET,PATCH,DELETE,OPTIONS
Access-Control-Allow-Methods: GET,PATCH,DELETE,OPTIONS

{
    "allow-methods": ["GET", "PATCH", "DELETE", "OPTIONS"]
}
```


### OPTIONS 

```json
OPTIONS /songs/:id
Accept: application/json

```

response type: allow methods array


```json
HTTP/1.1 200 OK
Content-Type: application/json
Allow: GET,POST,OPTIONS
Access-Control-Allow-Methods: GET,POST,OPTIONS

{
    "allow-methods": ["GET", "POST",  "OPTIONS"]
}
```