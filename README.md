node-gmail-api
==============

Node module to interact with the gmail api

Why not the [google official library](https://github.com/google/google-api-nodejs-client)? Well it does too much and doesn't implement batching.
Which means fetching a bunch of email is insanely painful. This module exposes a function which will query the api searching for messages and hit the google
batch api to fetch all the messages that are returned.

Example
=======

```
// Fetch latest 10 emails and show the snippet
var gmail = new Gmail(key)
  , s = gmail.messages('label:inbox', {max: 10})

s.on('data', function (d) {
  console.log(d.snippet)
})
```
