const express = require('express');
const reservationRoutes = require('./reservation/ReservationService');
const paymentRoutes = require('./payment/PaymentService');
const app = express();
const port = 3700;

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

const db = require('./db/dbAPI');

app.get('/', (req, res) => {
    res.send('Hello World!')
});

app.use('/', reservationRoutes.router);
app.use('/', paymentRoutes.router);


app.get('/freeTickets', async(req, res)=>{
    res.json(await db.findFreeTickets());
});




/**
 *  Route used for testing ONLY
 *  Resets db mock.
 */

 app.use('/reset', (req, res)=>{
    const Ticket = require('./db/TicketClass');
    const Reservation = require('./db/ReservationClass');
    const EMPTY_RESERVATION = '_000000';

    db.users = { '_4a12pz': {}, '_5s73fs': {} };
    db.reservations = {
        '_4kwcny': new Reservation({ userID: '_4a12pz', ticketID: ['_6c1iu1'], amount: 15, id: '_4kwcny' })
    };
    db.tickets = {
        '_j8w6y6': new Ticket({ price: 25, reservationID: EMPTY_RESERVATION, id: '_j8w6y6' }),
        '_gd74ae': new Ticket({ price: 20, reservationID: EMPTY_RESERVATION, id: '_gd74ae' }),
        '_6c1iu1': new Ticket({ price: 15, reservationID: '_4kwcny', id: '_6c1iu1' })
    }
    db.soldTickets = {};

    return res.send('OK');
});




app.listen(port, () => {
    //console.log(`Example app listening at http://localhost:${port}`);
});
