var Transform = require('stream').Transform
  , util = require('util')

function Parser (opts) {
  if (!(this instanceof Parser)) {
    return new Parser(opts)
  }
  opts = opts || {}
  this.opts = opts
  Transform.call(this, opts)
}

util.inherits(Parser, Transform)

// A stream that reduces data elements
Parser.prototype._transform = function (data, encoding, done) {
  var obj
  try {
    if (data) {
      obj = JSON.parse(data.toString())
    }
  } catch (e) {
    // Don't care
  }

  if (obj !== undefined) {
    this.push(this.opts.objectMode ? obj : JSON.stringify(obj))
  }
  done()
}

module.exports = Parser
