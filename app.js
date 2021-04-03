const express = require('express')
const reservationRoutes = require('./reservation/ReservationService');
const app = express()
const port = 3700

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.send('Hello World!')
})


app.get('/reserve', reservationRoutes.handleReservationRequest, reservationRoutes.validateRequest,  reservationRoutes.createNewReservation);


app.listen(port, () => {
    console.log(`Example app listening at http://localhost:${port}`)
})
