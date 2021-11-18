const express = require('express');
const app = express();
const PORT = 8080;

app.listen(
    PORT,
    () => console.log(`hij leeft op http://localhost:${PORT}`)
)

app.use( express.json() )

app.get('/test', (req, res) => {
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
        foo: `jo je id is ${id} en de testwaarde is ${test}`,
    });
});