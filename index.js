var request = require('request')
  , Parser = require('./lib/parser')
  , split = require('split')
  , multiparty = require('multiparty')
  , ss = require('stream-stream')
  , api = 'https://www.googleapis.com'

var Gmail = function (key) {
  if (!key) {
    throw new Error('Access key required')
  }
  this.key = key
}

/*
 * Fetches email that matches the query. Returns a stream of messages
 *
 * e.g. to search an inbox: gmail.messages('label:inbox')
 */
Gmail.prototype.messages = function (q, opts) {
  var key = this.key
    , result = ss()
    , opts = opts || {}

  request({
    url: api + '/gmail/v1/users/me/messages',
    json: true,
    qs: {
      q: q
    },
    headers: {
      'Authorization': 'Bearer ' + key
    }
  }, function (err, response, body) {
    if (err) {
      return result.emit('error', err)
    }
    var body = body.messages.map(function (m) {
      return {
        'Content-Type': 'application/http',
        body: 'GET ' + api + '/gmail/v1/users/me/messages/' + m.id + '\n'
      }
    })

    if (opts.max) {
      body.length = opts.max
    }

    var r = request({
      method: 'POST',
      url: api + '/batch',
      multipart: body,
      headers: {
        'Authorization': 'Bearer ' + key,
        'content-type': 'multipart/mixed'
      }
    })

    r.on('error', function (e) {
      result.emit('error', e)
    })

    r.on('response', function (res) {
      var type = res.headers['content-type']
        , form = new multiparty.Form

      res.headers['content-type'] = type.replace('multipart/mixed', 'multipart/related')

      form.on('part', function (part) {
        result.write(part.pipe(split('\r\n')).pipe(new Parser))
      }).parse(res)
    })
  })

  return result.pipe(new Parser({objectMode: true}))
}

module.exports = Gmail
