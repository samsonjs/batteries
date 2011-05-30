// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var fs = require('fs')
  , util = require('util')
  , EventEmitter = require('events').EventEmitter
  , FileExt = require('./file-ext')
  ;

module.exports = FileFollower;

// TODO: option to act like tail and only show the last N lines, N >= 0
function FileFollower(file, options) {
  options = options || {};
  var self = this;
  this.file = file;
  this.currSize = fs.statSync(file).size;
  this.prevSize = this.currSize;
  this.interval = options.interval || 1000;
  FileExt.eachLine(file,
    { line: function(line) {
        self.emit('line', line);
      }
    , end: function() {
        self.startFollowing();
      }
    });
}
util.inherits(FileFollower, EventEmitter);

FileFollower.prototype.startFollowing = function() {
  if (this._interval) {
    console.warn('already following');
    return;
  }
  this.buffer = '';
  this.fd = fs.openSync(this.file, 'r');
  this._interval = setInterval(this.checkForLine.bind(this), this.interval);
};

FileFollower.prototype.stopFollowing = function() {
  if (!this._interval) {
    console.warn('not following');
    return;
  }
  delete this.buffer;
  clearInterval(this._interval);
  delete this._interval;
  fs.closeSync(this.fd);
  delete this.fd;
};

FileFollower.prototype.checkForLine = function() {
  this.currSize = fs.statSync(this.file).size;
  if (this.currSize > this.prevSize) {
    var n = this.currSize - this.prevSize
      , buf = new Buffer(n + 1)
      , self = this
      ;
    fs.read(this.fd, buf, 0, n, this.prevSize, function(err, bytesRead, buffer) {
      if (err) {
        self.emit('error', err);
        return;
      }
      self.buffer += buf.slice(0, bytesRead);
      self.prevSize += bytesRead;
      var i;
      while ((i = self.buffer.indexOf('\n')) !== -1) {
        self.emit('line', self.buffer.slice(0, i));
        self.buffer = self.buffer.slice(i + 1);
      }
    });
  }
};
