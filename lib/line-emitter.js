var fs = require('fs')
  , sys = require('sys')
  , EventEmitter = require('events').EventEmitter
  ;

exports.LineEmitter = LineEmitter;
function LineEmitter(fileOrStream) {
    var self = this
      , stream = typeof fileOrStream === 'string' ? fs.createReadStream(fileOrStream) : fileOrStream
      ;
    this.buffer = '';
    this.ended = false;
    stream.on('data', function(chunk) {
        self.buffer += chunk;
        self.checkForLine();
    })
    stream.on('end', function() { self.ended = true; });
    stream.on('error', function(err) { self.emit('error', err); });
}
sys.inherits(LineEmitter, EventEmitter);

LineEmitter.prototype.checkForLine = function() {
    var i = this.buffer.indexOf('\n')
      , self = this
      ;
    if (i === -1) {
        if (this.ended) {
            if (this.buffer.length > 0) self.emit('line', this.buffer);
            self.emit('end');
        }
        return;
    }
    this.emit('line', this.buffer.slice(0, i));
    this.buffer = this.buffer.slice(i + 1);
    process.nextTick(function() { self.checkForLine(); });
};
