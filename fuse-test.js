var fuse = require('./lib/fuse')
  , a = []
  , n = Number(process.argv[2]) || 10000000 // 10,000,000
  , iters = a.length
  , parts = []
  , s
  , start
  ;

iters = n;
while (iters >= 1) {
    s = (iters % 1000).toString();
    if (iters / 1000 >= 1) while (s.length < 3) s = '0' + s;
    parts.push(s);
    iters = iters / 1000;
}
console.log(parts.reverse().join(',') + ' iterations');
while (n--) a.push(n);

function time(title, fn, cb) {
    console.log('---- ' + title + ' ----');
    var i = 0
      , n = 5
      , start
      , avg = 0
      , min
      , max = 0
      , next = function() {
            start = +new Date();
            fn(function() {
                var time = +new Date() - start;
                if (time > max) max = time;
                if (!min || time < min) min = time;
                avg += time;
                if (++i < n) next();
                else done();
            });
        }
      , done = function() {
            avg /= n;
            console.log('avg: ' + avg + 'ms');
            console.log('min: ' + min + 'ms');
            console.log('max: ' + max + 'ms');
            console.log();
        }
    next();
}

function timeSync(title, fn, cb) {
    console.log('---- ' + title + ' ----');
    var i = 0
      , n = 5
      , start
      , avg = 0
      , min
      , max = 0
      ;
    for (; i < n; ++i) {
        start = +new Date();
        fn();
        var time = +new Date() - start;
        if (time > max) max = time;
        if (!min || time < min) min = time;
        avg += time;
    }
    avg /= n;
    console.log('avg: ' + avg + 'ms');
    console.log('min: ' + min + 'ms');
    console.log('max: ' + max + 'ms');
    console.log();
}

// Plain old while loop
timeSync('while loop', function() {
    var b = []
      , i = a.length
      ;
    while (i--) {
        b[i] = (a[i] + 1) * 2;
        for (var j = 0; j < 100; ++j) j;
    }
});

// Composed map
timeSync('composed map', function() {
    a.map(function(x) {
        for (var j = 0; j < 100; ++j) j;
        return (x + 1) * 2;
    });
});

// Chained map (modular)
timeSync('chained map', function() {
    a.map(add1).map(wasteTime).map(times2);
});

// Synchronous fused map
timeSync('fused map (sync)', function() {
    fuse.fusedMapSync(add1, wasteTime, times2)(a);
});

// Asynchronous fused map (test not actually async, but meh)
time('fused map (async)', function(cb) {
    fuse.fusedMap(add1Async, wasteTimeAsync, times2Async)(a, function(b) {
        cb();
    });
});

function add1(v) { return v + 1; }
function times2(v) { return v * 2; }
function wasteTime(v) {
    for (var i = 0; i < 100; ++i) i;
    return v;
}

function add1Async(v, cb) { cb(v + 1); }
function times2Async(v, cb) { cb(v * 2); }
function wasteTimeAsync(v, cb) {
    for (var i = 0; i < 100; ++i) i;
    cb(v);
}
