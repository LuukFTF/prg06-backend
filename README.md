# prg06-backend (Nodejs API)

## Checker

https://stud.hosted.hr.nl/0987896/webservice.json

```json
{  
    "uri": "http://145.24.222.193:8000/songs/", 
    "uitleg": "lucas van der vegts song api versie 1.1"  
} 
```

```json
{
    "uri": "https://stud.hosted.hr.nl/0987896/webservice.json",
    "fields": [title, author, inRepertoireSince]
}
```

## General Design

- content
- pagination
- links

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
            "id": "6",
            "title": "lorem",
            "body": "lorem",
            "_links": {
                "self": { "href": "http://host/items/6" },
                "collection": { "href": "http://host/items/" }
            },    
    ],
    "links": {
        "self": { "href": "http://host/items/?start=5&limit=2" },
        "collection": { "href": "http://host/items/" }
        
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
HTTP/1.1 4xx/5xx ERROR
Content-Type: application/json

{ 
    "message": "error message" 
}
```

### PING

```json
GET /ping HTTP/1.1
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
GET /songs HTTP/1.1
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
        "self": { "href": "http://host/songs/?start=5&limit=2" },
        "collection": { "href": "http://host/songs/" }
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
GET /songs/:id HTTP/1.1
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
POST /songs HTTP/1.1
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

### PUT

```json
POST /songs/:id HTTP/1.1
Accept: application/json
Content-Type: application/json

{
    "title": "Blitzkrieg Bop",
    "author": "Ramones",
    "inRepertoireSince": "2022"
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
POST /songs/:id HTTP/1.1
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

### OPTIONS 

```json
OPTIONS /songs/:id HTTP/1.1
Accept: application/json

```

response type: allow methods array


```json
HTTP/1.1 200 OK
Content-Type: application/json
Allow: GET,POST,OPTIONS
Access-Control-Allow-Methods: GET,POST,OPTIONS

{
    "allow-methods": ["GET", "POST", "OPTIONS"]
}
```


### OPTIONS :id

```json
OPTIONS /songs/:id HTTP/1.1
Accept: application/json

```

response type: allow methods array


```json
HTTP/1.1 200 OK
Content-Type: application/json
Allow: GET,PUT,DELETE,OPTIONS
Access-Control-Allow-Methods: GET,PUT,DELETE,OPTIONS

{
    "allow-methods": ["GET", "PUT", "DELETE", "OPTIONS"]
}
```