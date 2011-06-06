// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var fs = require('fs')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter
  ;

module.exports = LineEmitter;

function LineEmitter(fileOrStream) {
  var self = this
    , stream = typeof fileOrStream === 'string' ? fs.createReadStream(fileOrStream) : fileOrStream
    ;
  this.buffer = '';
  this.ended = false;
  this.endEmitted = false;
  stream.on('data', function(chunk) {
    self.buffer += chunk;
    self.checkForLine();
  });
  stream.on('end', function() {
    self.ended = true;
    self.checkForLine();
  });
  stream.on('error', function(err) {
    self.ended = true;
    self.emit('error', err);
  });
}
util.inherits(LineEmitter, EventEmitter);

LineEmitter.prototype.checkForLine = function() {
  var i = this.buffer.indexOf('\n')
    , self = this
    ;
  if (i === -1) {
    if (this.ended && !this.endEmitted) {
      if (this.buffer.length > 0) self.emit('line', this.buffer);
      this.buffer = '';
      this.endEmitted = true;
      self.emit('end');
    }
    return;
  }
  this.emit('line', this.buffer.slice(0, i));
  this.buffer = this.buffer.slice(i + 1);
  process.nextTick(function() { self.checkForLine(); });
};
