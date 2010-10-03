var sys = require('sys')
  , EventEmitter = require('events').EventEmitter

exports.LineEmitter = LineEmitter
function LineEmitter(stream) {
    var self = this
    this.buffer = ''
    stream.on('data', function(chunk) {
        self.buffer += chunk
        process.nextTick(function() { self.checkForLine() })
    })
    stream.on('end', function() { this.emit('end') })
    stream.on('error', function(err) { this.emit('error', err) })
}
sys.inherits(LineEmitter, EventEmitter)

LineEmitter.prototype.checkForLine = function() {
    var i = this.buffer.indexOf('\n')
      , self = this
    if (i === -1) return
    this.emit('line', this.buffer.slice(0, i))
    this.buffer = this.buffer.slice(i + 1)
    if (this.buffer.indexOf('\n') !== -1) {
        process.nextTick(function() { self.checkForLine() })
    }
}
