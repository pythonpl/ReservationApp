const app = require('../../app');

const request = require('supertest');
const ERRORS = require('../../utils/commonErrors');

const URL = 'http://localhost:3700';


const generateData = function (q) {
    const table = []
    for (let i = 0; i < q; i++){
        table.push(i);
    }
    return table;
}

const concurrentTests = generateData(10000);

describe.skip('load test', () => {

    test.concurrent('should return success 1', async () => {

        const inputData = { userID: '_4a12pz', ticketID: ["_j8w6y6"] };

        const route = '/reserve'

        await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
            expect(res.body).toHaveProperty('id');
            expect(res.body).toHaveProperty('price', 25);
        });

    })

    test.concurrent.each(concurrentTests)('should fail', async () => {

        const inputData = { userID: '_4a12pz', ticketID: ["_j8w6y6"] };

        const route = '/reserve'

        await request(URL).post(route).send(inputData).expect('Content-Type', /json/).expect(200).then((res) => {
            expect(res.body).toBe(ERRORS.TicketsAlreadyTaken);
        });

    })

});

describe('show free', ()=>{
    test.concurrent.each(concurrentTests)('should return 200', async () => {
        const route = '/freeTickets'

        await request(URL).get(route).expect('Content-Type', /json/).expect(200);

    })
})