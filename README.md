node-gmail-api
==============

Node module to interact with the gmail api.

Why not the [google official library](https://github.com/google/google-api-nodejs-client)? Well it does too much and doesn't implement batching.
Which means fetching a bunch of email is insanely painful. This module exposes a function which will query the api searching for messages and hit the google batch api to fetch all the messages that are returned.

### Authenticating users

To use this module, you'll need an oauth access token key. See more details here: https://developers.google.com/gmail/api/overview#auth_and_the_gmail_api.

You may use [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth) to get an access key for a user, then use this module to make requests on behalf of the authenticated user.

Example authentication call (cf. [passport-google-oauth](https://github.com/jaredhanson/passport-google-oauth) for more complete usage examples):

````javascript
passport.use(new GoogleStrategy({
		clientID: config.googleApp.clientId
		, clientSecret: config.googleApp.clientSecret
		, userProfileURL: 'https://www.googleapis.com/oauth2/v3/userinfo'
		, callbackURL: config.baseurl + '/oauth2callback'
	}
	, function(accessToken, refreshToken, profile, done) {
		// do your thing here
	}
))
````

Example
=======

### Fetch latest 10 emails and show the snippet

````javascript
// assuming access token has already been retrieved inside variable `accessToken`

var Gmail = require('node-gmail-api')
  , gmail = new Gmail(accessToken)
  , s = gmail.messages('label:inbox', {max: 10})

s.on('data', function (d) {
  console.log(d.snippet)
})
````

### Optionally request the fields you want (for performance)

cf. [gmail API performance guide](https://developers.google.com/gmail/api/guides/performance).

````javascript

var Gmail = require('node-gmail-api')
  , gmail = new Gmail(accessToken)
  , s = gmail.messages('label:inbox', { fields: ['id', 'internalDate', 'labelIds', 'payload']})

s.on('data', function (d) {
  console.log(d.id)
})
````

### Optionally request the format you want (e.g full (default), raw, minimal, metadata)

````javascript

var Gmail = require('node-gmail-api')
  , gmail = new Gmail(accessToken)
  , s = gmail.messages('label:inbox', {format: 'raw'})

s.on('data', function (d) {
  console.log(d.raw)
})
````

License
=======

ISC
