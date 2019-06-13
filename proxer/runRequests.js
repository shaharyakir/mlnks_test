let axios = require('axios');
const {urlTests, encodeJSON} = require('./testUtils');

for (const test of urlTests) {

    axios.get(`/fetch/${encodeJSON(test.urls)}?errors=[${test.errorStrategy}]`).catch(err => {});

}