var test = require('tape')
  , nock = require('nock')
  , Gmail = require('../')

test('retrieves message count', function (t) {
  t.plan(1)
  nock('https://www.googleapis.com')
    .get('/gmail/v1/users/me/messages?q=label%3Ainbox&fields=resultSizeEstimate')
    .reply(200, {resultSizeEstimate: 2})

  var gmail = new Gmail('key')
  gmail.estimatedMessages('label:inbox', {timeout: 3000}, function (err, count) {
    t.equal(count, 2)
    t.end()
  })
})

test('retrieves message count', function (t) {
  t.plan(1)

  nock('https://www.googleapis.com')
    .get('/gmail/v1/users/me/threads?q=label%3Ainbox&fields=resultSizeEstimate')
    .reply(200, {resultSizeEstimate: 3})

  var gmail = new Gmail('key')
  gmail.estimatedThreads('label:inbox', function (err, count) {
    t.equal(count, 3)
    t.end()
  })
})

test('retrieves threads', function (t) {
  t.plan(5)
  nock('https://www.googleapis.com')
    .get('/gmail/v1/users/me/threads?q=label%3Ainbox')
    .replyWithFile(200, __dirname + '/initial.json')

  nock('https://www.googleapis.com')
    .post('/batch')
    .replyWithFile(200, __dirname + '/batched.json', {
      'content-type': 'multipart/mixed; boundary=batch_FmDEX85qSFQ=_AAlNL3-GN3E='
    })

  var gmail = new Gmail('key')
    , stream = gmail.threads('label:inbox')
    , data

  stream.on('data', function (d) {
    data = d
  })
  stream.on('end', function () {
    t.equal(data.id, '147dae72a4bab6b4')
    t.equal(data.historyId, '6435511')
    t.equal(data.messages.length, 1)
    t.equal(data.messages[0].snippet, 'This is a test email.')
    t.equal(stream.resultSizeEstimate, 1)
    t.end()
  })
})

test('retrieves messages', function (t) {
  t.plan(5)
  nock('https://www.googleapis.com')
    .get('/gmail/v1/users/me/messages?q=label%3Ainbox')
    .replyWithFile(200, __dirname + '/initial.json')

  nock('https://www.googleapis.com')
    .post('/batch')
    .replyWithFile(200, __dirname + '/batched.json', {
      'content-type': 'multipart/mixed; boundary=batch_FmDEX85qSFQ=_AAlNL3-GN3E='
    })

  var gmail = new Gmail('key')
    , stream = gmail.messages('label:inbox', {format : 'raw'})
    , data

  stream.on('data', function (d) {
    data = d
  })
  stream.on('end', function () {
    t.equal(data.id, '147dae72a4bab6b4')
    t.equal(data.historyId, '6435511')
    t.equal(data.messages.length, 1)
    t.equal(data.messages[0].snippet, 'This is a test email.')
    t.equal(stream.resultSizeEstimate, 1)
    t.end()
  })
})
