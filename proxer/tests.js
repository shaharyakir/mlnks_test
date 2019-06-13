const assert = require('assert');
const app = require('./app');
const supertest = require('supertest')(app);

let encodeJSON = (arr) => encodeURIComponent(Buffer.from(JSON.stringify(arr)).toString('base64'));

let urlTests = [
    {
        description: 'fail entire request due to a single 404 endpoint',
        urls: ['https://reqres.in/api/users?page=2', 'https://reqres.in/api/users/23'],
        errorStrategy: 'fail_any',
        validateFunc: (res => assert.equal(res.statusCode, 500))
    },
    {
        description: 'contain a failure due to a single 404 endpoint',
        urls: ['https://reqres.in/api/users?page=2', 'https://reqres.in/api/users/23'],
        errorStrategy: 'replace',
        validateFunc: (res => assert.equal(res.text.includes('"failed"'), true))
    },
    {
        description: 'succeed with multiple endpoints',
        urls: ['https://reqres.in/api/users/2', 'https://reqres.in/api/users/3'],
        errorStrategy: 'replace',
        validateFunc: (res => {
            assert.equal(res.statusCode, 200);
            assert.equal(res.body.length, 2)
        })
    },
    {
        description: 'succeed with a single endpoint',
        urls: ['https://reqres.in/api/users/2'],
        errorStrategy: 'replace',
        validateFunc: (res => {
            assert.equal(res.statusCode, 200);
            assert.equal(res.body.length, 1)
        })
    }
];

describe('/fetch', () => {

    it('should return 500 on malformed urls JSON', function (done) {

        supertest
            .get('/fetch/dddd==?errors=[fail_any]')
            .expect(500, done)

        // .expect(200, done);

    });

    it('should return 404 on missing urls param', function (done) {

        supertest
            .get('/fetch')
            .expect(404, done)


    });

    urlTests.forEach(test => {

        it(`should ${test.description}`, function (done) {

            supertest
                .get(`/fetch/${encodeJSON(test.urls)}?errors=[${test.errorStrategy}]`)
                .set('Accept', 'application/json')
                .expect(test.validateFunc)
                .end((err,res) => {

                    console.log(res.body);
                    console.log(res.statusCode);

                    if (err) { throw err }


                    done();

                });

        });

    });

});

describe('/monitoring', () => {

    it('should return a JSON', function (done) {

        supertest
            .get('/monitoring')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done)

    });

});