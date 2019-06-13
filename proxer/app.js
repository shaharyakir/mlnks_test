const express = require('express');
const app = express();
const port = 80;
const axios = require('axios');

app.use(require('cors')());

const state = {
    requestCount: 0,
    errorCount: 0,
    requests: []
};

// http://proxer.com/fetch/<base64>?errors=[fail_any]

let errorStrategies = {failAny: 'fail_any', replace: 'replace'};

const parseUrls = urls => {

    let urlsBs64Decoded = decodeURIComponent(Buffer.from(urls, 'base64').toString());

    try {
        return (JSON.parse(urlsBs64Decoded));
    } catch (e) {
        return null;
    }

};

// TODO extract funcs
app.get('/fetch/:urls', (req, res, next) => {

    let errorStrategy = req.query.errors.match(/\[(.*)\]/)[1];

    let urls = parseUrls(req.params.urls);

    if (urls === null) {
        res.status(500).end('Urls should be in JSON format');
        return
    }

    state.requestCount++;

    let isFoundError = false;

    Promise.all(
        urls.map(url =>
            axios.get(url)
                .then(resp => ({[resp.config.url]: resp.data.data}))
                .catch((err) => {

                    isFoundError = true;

                    if (errorStrategy === errorStrategies.replace) {

                        return {url: 'failed'};

                    } else {

                        throw err;

                    }
                }))

    )
        .then((responses) => {

            state.requests.push({url: req.url, responses: responses});

            res.json(responses);

        })
        .catch((err) => {

            state.requests.push({url: req.url, responses: [{result: 'All responses failed'}]});

            res.status(500).end()

        }).finally(() => {

            if (isFoundError) { state.errorCount++; }

        });

});

app.get('/monitoring', (req, res, next) => {

    res.json({
        requestCount: state.requestCount,
        errorAverage: state.errorCount / state.requestCount,
        requests: state.requests.slice(0, 10)
    });

});

app.get('*', (req, res) => res.status(404).end());

app.listen(port, () => console.log(`proxer on port: ${port}! ${process.env.NODE_ENV}`));

module.exports = app;

