var fs = require('fs')
  , LineEmitter = require('./line-emitter').LineEmitter

exports.extend = function(obj) {
    FileExt.extend(obj)
}

var FileExt = exports.FileExt = {

    eachLine: function(f, fn, cb) {
        var le = new LineEmitter(fs.createReadStream(f))
        le.on('line', fn)
        le.on('end', cb)
    }

  , readLines: function(f, cb) {
        var lines = []
          , addLine = function(line) {
                lines.push(line)
            }
        FileExt.eachLine(f, addLine, function() { cb(lines) })
    }
}
