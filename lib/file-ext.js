var constants = require('constants')
  , fs = require('fs')
  , ArrayExt = require('./array-ext').ArrayExt
  , LineEmitter = require('./line-emitter').LineEmitter
  , ext = require('./ext')
  , ENOENT = constants.ENOENT
  ;

exports.extend = function(obj) {
    ext.extend(obj || fs, FileExt);
}

var FileExt = exports.FileExt = {

    eachLine: function(f, options) {
        if (typeof options === 'function') options = {line: options, end: arguments[2]};
        var lineType = typeof options.line
          , endType = typeof options.end
          ;
        if (lineType !== 'function' && endType !== 'function')
            throw new Error('bad arguments');
        var le = new LineEmitter(f);
        if (typeof options.line === 'function')
            le.on('line', function(line) { options.line(line); });
        if (typeof options.end === 'function')
            le.on('end', function() { options.end(); });
    }

  , exists: function(f) {
        try {
            fs.statSync(f)
            return true
        } catch (e) {
            if (e.errno === ENOENT) return false
            throw e
        }
    }

  , grep: function(regex, f, callback) {
        if (!callback) throw new Error('grep requires a callback');
        var results = [];
        FileExt.eachLine(f,
            { line: function(line) { if (line.match(regex)) results.push(line); }
            , end: callback(results)
            });
    }

  , home: function(user, callback) {
        // user is optional so the first param may be a callback
        if (typeof user === 'function') {
            callback = user;
            user = null;
        }
        if (user && callback && user !== process.env['USER']) {
            FileExt.grep(new RegExp('^' + user + ':'), '/etc/passwd', function(line) {
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

  , readLines: function(f, cb) {
        var lines = [];
        FileExt.eachLine(f, { line: function(line) { lines.push(line); }
                            , end: function() { cb(lines); }
                            });
    }

};

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
