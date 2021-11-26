console.log("Started server");

const express = require("express");
const { appendFile } = require("fs");

const mongoose = require("mongoose");
mongoose.connect('mongodb://localhost/songs')

app.use(express.json());
app.use(express.urlencoded({extended: true}));

app.get("/", (req, res) => {
    res.status(200).send({
        foo: 'bruh'
    })
});

app.post('/test/:id', (req, res) => {
    const { id } = req.params;
    const { test } = req.body;

    if (!test) {
        res.status(418).send({ message: `We hebbe een testwaarde nodig, nu ist ${id} & ${test}` })
    }

    res.send({
        foo: `jo, je id is ${id} en de testwaarde is ${test}`,
    });
});