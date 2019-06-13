const assert = require('assert');
const app = require('./app');
const supertest = require('supertest')(app);
const {urlTests, encodeJSON} = require('./testUtils');

describe('/fetch', () => {

    it('should return 500 on malformed urls JSON', function (done) {

        supertest
            .get('/fetch/dddd==?errors=[fail_any]')
            .expect(500, done)

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