// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var fs = require('fs')
  , batteries = require('../')
  , FileFollower = require('./file-follower')
  , LineEmitter = require('./line-emitter')
  , constants = require('constants')
  , FileExt
  ;

FileExt =
{ eachLine: eachLine
, exists: exists
, follow: follow
, grep: grep
, home: home
, readLines: readLines
}

// isDirectory, isFile, isSymbolicLink, etc.
var s = fs.statSync(__dirname);
Object.keys(Object.getPrototypeOf(s)).forEach(function(k) {
  if (k.match(/^is/) && typeof s[k] === 'function') {
    FileExt[k] = function(f, cb) {
      if (cb) {
        fs.stat(f, function(err, stat) {
          cb(err, err ? null : stat[k]());
        });
      } else {
        return fs.statSync(f)[k]();
      }
    }
  }
});

exports.extendNative = function() {
  batteries.object.extend(fs, FileExt);
};

batteries.object.extend(exports, FileExt);

function eachLine(f, optionsOrLineFn, endFn) {
  var lineFn, hasLineFn, hasEndFn;
  if (typeof optionsOrLineFn === 'object') {
    lineFn = optionsOrLineFn.line;
    endFn = optionsOrLineFn.end;
  }
  else if (typeof optionsOrLineFn === 'function') {
    lineFn = optionsOrLineFn;
  }
  hasLineFn = typeof lineFn == 'function';
  hasEndFn = typeof endFn == 'function';
  if (!hasLineFn && !hasEndFn) throw new Error('bad arguments');
  var le = new LineEmitter(f);
  if (hasLineFn) le.on('line', lineFn);
  if (hasEndFn) le.on('end', endFn);
}

function exists(f) {
  try {
    fs.statSync(f);
    return true;
  } catch (e) {
    if (e.errno === constants.ENOENT) return false;
    throw e;
  }
}

function follow(f, lineFn) {
  var ff = new FileFollower(f);
  ff.on('line', lineFn);
  return {
    stop: ff.stopFollowing.bind(ff)
  };
}

function grep(regex, f, callback) {
  if (!callback) throw new Error('grep requires a callback');
  var results = [];
  eachLine(f,
    { line: function(line) { if (line.match(regex)) results.push(line); }
    , end: function() { callback(results); }
    });
}

function home(user, callback) {
  // user is optional so the first param may be a callback
  if (typeof user === 'function') {
    callback = user;
    user = null;
  }
  if (user && callback && user !== process.env['USER']) {
    grep(new RegExp('^' + user + ':'), '/etc/passwd', function(line) {
      callback(line && line.split(':')[4]);
    });
  }
  else if (user)
    throw new Error('home requires a callback with user');
  else if (callback)
    callback(process.env['HOME']);
  else
    return process.env['HOME'];
}

function readLines(f, cb) {
  var lines = [];
  eachLine(f, { line: function(line) { lines.push(line); }
              , end: function() { cb(lines); }
              });
}
