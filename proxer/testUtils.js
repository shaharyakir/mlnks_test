module.exports = {
    urlTests: [
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
            description: 'contain multiple failures due to a single 404 endpoint',
            urls: ['https://reqres.in/api/users?page=2', 'https://reqres.in/api/users/23', 'https://reqres.in/api/users/24', 'https://reqres.in/api/users/25'],
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
    ],
    encodeJSON: (arr) => encodeURIComponent(Buffer.from(JSON.stringify(arr)).toString('base64'))
};