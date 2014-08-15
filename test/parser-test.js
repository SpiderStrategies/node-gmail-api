var test = require('tape')
  , Parser = require('../lib/parser')

test('parses objects as string, not object mode', function (t) {
  var p = new Parser

  p.on('data', function (d) {
    t.equal(d.toString(), '{}')
    t.deepEqual(JSON.parse(d.toString()), {})
  })

  p.write('{}')
  t.end()
})

test('parses objects, object mode', function (t) {
  var p = new Parser({objectMode: true})

  p.on('data', function (d) {
    t.deepEqual(d, {})
  })

  p.write('{}')
  t.end()
})
