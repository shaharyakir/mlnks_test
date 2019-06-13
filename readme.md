# Proxer - Tech Spec

## Server
Will use node.js + express + axios

- `/fetch` endpoint

````
errorStrategy = ...

urls = baseDecode(lastPart) // try/catch the JSON parsing, if fails return 500

results = Promise.all(urls.map -> fetch($0).catchError(() => {

if errorStrategy==replace { return 'failed' }))
else throw Error

}.catchError(return null)

pushMonitoringData(++counter, +=errorCount, requests)

if null return 500
else return results
````

- `/monitoring` endpoint

````
data = fetchHistoricData()
return {reqCount, avgErr as errCount / reqCount, reqs.slice(0,10)}
````

## How to run
Start server from /proxer/app.js

Start client from /proxer-client - npm run start

Run requests (for monitoring data to get filled) - /proxer/runRequests.js

## Tooling/Code
- Will use supertest - testing http requests should save time
- Will use axios
- Not using async/await because I prefer the promise error handling style in this case
- Using create-react-app for a quick start with the client

## Assumptions
- Assuming fetched urls always either return a 200/JSON or a 400...500 error code (not taking into account that we may fetch a non JSON valid (200) site
- In both error strategies, per request at most the errorCount will be increment once
- Historic data is memory only and is not persisted between runs. Also not handling memory constraints (every request gets inserted to the state memory data)
- Tester has mocha installed (if wishes to run tests)
- Not validating whether error querystring was sent (assuming it always gets sent and always contains one of the two valid values)
- Only basic effort in monitoring client design
- "Total number of calls that proxer handled" - assuming that refers to proxy requests, not to endpoint requests

## Production Notes
- Would increase test coverage (e.g. test monitoring metrics after failing requests)
- The tests should be more thorough (test multiple aspect of the result, e.g. failueCount in replace strategy etc.)
- Would sanitize input using express-validator
- Would persist monitoring data to a database/redis which would enable scaling out
- Would separate the /monitoring endpoint to a different server/container to better support scale out and eliminate performance interference with core functionality (/fetch)
- Would limit max. number of URLs to process to prevent misuse
- Would need to discuss product-wise whether it makes sense to cache responses at the proxer level.
- Can cache endpoints responses (if they define themselves as cacheable) to a persistent store and use them until the cache has gone stale

## Time Division
- Tech Spec Design (most of this readme) + Questions preparation - 40 minutes
- Server
  - Set up env. - 10 minutes
  - Tests - 45 minutes
  - /fetch - 45 minutes
  - /monitoring - 10 minutes
- Client
  - Set up - 5 minutes
  - Deciding on UI presentation - 15 minutes
  - Coding - 20 minutes 
- End-To-End Testing
	- API refactoring + fixes - 15 minutes
