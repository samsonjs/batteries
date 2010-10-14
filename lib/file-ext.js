var fs = require('fs')
  , ArrayExt = require('./array-ext').ArrayExt
  , LineEmitter = require('./line-emitter').LineEmitter
  , ext = require('./ext')
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

  , grep: function(regex, f, callback) {
        if (!callback) throw new Error('grep requires a callback');
        var results = [];
        FileExt.eachLine(f,
            { line: function(line) { if (line.match(regex)) results.push(line); }
            , end: callback(results)
            });
    }

  , home: function(user, callback) {
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
