const app = require('../../app');

const request = require('supertest');
const ERRORS = require('../../utils/commonErrors');

const URL = 'http://localhost:3700';


afterEach(async () => {
    return await request(URL).get('/reset');   
});

describe('INTEGRATION TESTS POST /reserve', () => {

    test('Should reject request with error ReservationRequestInvalid', async ()=>{

        const route = '/reserve';

        const inputData = {
            userID: 1,
            ticketID: [1, 2]
        };

        const expected = JSON.stringify(ERRORS.ReservationRequestInvalid);

        await request(URL).post(route).send(inputData).expect(expected);
    })

    test('Should reject request with error ReservationRequestInvalid', async ()=>{

        const route = '/reserve';
        
        const inputData = {};

        const expected = JSON.stringify(ERRORS.ReservationRequestInvalid);

        await request(URL).post(route).send(inputData).expect(expected);
    })

    test('Should return {id, price} successfully', async ()=>{

        const route = '/reserve';
        
        const inputData = { userID: '_4a12pz', ticketID: ["_j8w6y6"]};

        await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('price', 25);
        });

    })

    test('Should return {id, price} for the first time, and errror TicketsAlreadyTaken for the second', async ()=>{

        const route = '/reserve';
        
        const inputData = { userID: '_4a12pz', ticketID: ["_j8w6y6"]};

        await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('price', 25);
        }).then(async()=>{
            await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
                expect(res.body).toBe(ERRORS.TicketsAlreadyTaken);
            });
        });

    })

})


describe('INTEGRATION TESTS POST /pay', () => {

    test('Should return success', async ()=>{

        const route = '/pay';

        const inputData = { userID: '_4a12pz', reservationID: '_4kwcny', token: 'paymenttoken' };;

        await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
            expect(res.body).toHaveProperty('status', 'success');
        });

    });

    test('Should return success at first payment attempt, and error at second', async ()=>{

        const route = '/pay';

        const inputData = { userID: '_4a12pz', reservationID: '_4kwcny', token: 'paymenttoken' };

        await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
            expect(res.body).toHaveProperty('status', 'success');
        }).then(async ()=>{
            await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
                expect(res.body).toBe(ERRORS.ReservationDataInvalid);
            });
        });

    });

    test('Should reject request with error ReservationRequestInvalid', async ()=>{

        const route = '/pay';

        const inputData = { userID: '_4a12pz', reservationID: '_599cny', token: 'paymenttoken' };

        await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
            expect(res.body).toBe(ERRORS.ReservationDataInvalid);
        });

    });

    

    test('Should reject request with error RequestInvalidData (userID and reservationID not associtated)', async ()=>{

        const route = '/pay';

        const inputData = { userID: '_5s73fs', reservationID: '_4kwcny', token: 'paymenttoken' };

        await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
            expect(res.body).toBe(ERRORS.RequestInvalidData);
        });

    });


    test('Should reject request with error PaymentDeclined', async ()=>{

        const route = '/pay';

        const inputData = { userID: '_4a12pz', reservationID: '_4kwcny', token: 'card_error' };

        await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
            expect(res.body).toBe(ERRORS.PaymentDeclined);
        });

    });

    test('Should reject request with error PaymentError', async ()=>{

        const route = '/pay';

        const inputData = { userID: '_4a12pz', reservationID: '_4kwcny', token: 'payment_error' };

        await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
            expect(res.body).toBe(ERRORS.PaymentError);
        });

    });


    
})




