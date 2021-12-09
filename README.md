# prg06-backend (Nodejs API)


## General Design

content
pagination
links

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

}
```

### POST

```json
POST /songs
Accept: application/json
Content-Type: application/json

{
    
}
```

response type: detail


```json
HTTP/1.1 200 OK
Content-Type: application/json

{

}
```

### PATCH

```json
POST /songs/:id
Accept: application/json
Content-Type: application/json

{
    
}
```

response type: detail


```json
HTTP/1.1 200 OK
Content-Type: application/json

{

}
```

### DELETE 

```json
POST /songs/:id
Accept: application/json
Content-Type: application/json

{
    
}
```

response type: message


```json
HTTP/1.1 200 OK
Content-Type: application/json

{

}
```




