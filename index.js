const app = require('express')();
const PORT = 8080;

app.listen(
    PORT,
    () => console.log(`hij leeft http://localhost:${PORT}`)
)

app.get('/test', (req, res) => {
    res.status(200).send({
        foo: 'bruh'
    })
})

// app.get('/test/:id', (req, res) => {
//     const { id } = req.params;
//     const { test } = req.body;

//     if (!test) {
//         res.status(418).send({ message: 'We hebbe een testwaarde nodig'})
//     }

//     res.send({
//         foo: `jo je id is ${id} en de testwaarde is `${test}`,
//     });
    
// });