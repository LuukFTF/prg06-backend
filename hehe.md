```json
/?start=3&limit=1
```

```json
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
```