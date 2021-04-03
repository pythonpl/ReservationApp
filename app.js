const express = require('express');
const reservationRoutes = require('./reservation/ReservationService');
const app = express();
const port = 3700;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = require('./db/dbAPI');

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.get('/tickets', (req, res) => {
    res.send(db.getAllTickets());
})

app.use('/', reservationRoutes.router);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`);
});
