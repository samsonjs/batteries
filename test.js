var fs = require('fs')
  , spawn = require('child_process').spawn
  , LineEmitter = require('./lib/line-emitter')
  ;


require('./lib/index').extendNative();


// wc -l, for reference

(function(n){
  var wc = spawn('wc', ['-l', __filename]);
  wc.stdout.on('data', function(chunk) {
    var m = chunk.toString().trim().split(/\s+/);
    n += m[0] || '';
  })
  wc.on('exit', function(code) {
    console.log(n + ' lines in this file [wc -l]');
  });
}(''));


// LineEmitter

var le = new LineEmitter(__filename)
  , lines = []
  ;
le.on('line', function(line) { lines.push(line); });
le.on('end', function() {
  console.log(lines.length + ' lines in this file [LineEmitter]');
});


// fs.eachLine (named params)

(function(n){
  fs.eachLine(__filename, {
      line: function(line) { ++n; },
      end: function() {
        console.log(n + ' lines in this file [eachLine (named params)]');
      }
  });
})(0);

  
// fs.eachLine (unnamed params)

(function(n){
  fs.eachLine(__filename, function(line) { ++n; }, function() {
    console.log(n + ' lines in this file [eachLine (unnamed params)]');
  });
}(0));


// fs.readLines
fs.readLines(__filename, function(lines) {
  console.log(lines.length + ' lines in this file [readLines]');
});

