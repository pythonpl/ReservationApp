const request = require('supertest');

describe('GET /', () => {
    test('Should return Hello World!', (done)=>{
        request('http://localhost:3700').get('/').expect(200, done).expect('Hello World!');
    })
})