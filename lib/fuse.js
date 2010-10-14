exports.extendArray = function() {
    Array.prototype.fusedMap = function() {
        var args = [].slice.call(arguments);
        return function(cb) {
            fusedMap.apply(null, args)(this, cb);
        }
    };
    Array.prototype.fusedMapSync = function() {
        return fusedMapSync.apply(null, arguments)(this);
    };
};

exports.fusedMap = fusedMap;
function fusedMap() {
    var fns = Array.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments);
    return function(a, cb) {
        var b = []
          , n = a.length
          ;
        a.forEach(function(v, i) {
            var nFns = fns.length
              , next = function(j) {
                    if (j < nFns)
                        fns[j](v, function(v) { next(j + 1); })
                    else
                        done();
                }
              , done = function() {
                    b[i] = v;
                    if (--n === 0) cb(b);
                }
            next(0);
        })
    }
}

exports.fusedMapSync = fusedMapSync;
function fusedMapSync() {
    var fns = Array.isArray(arguments[0]) ? arguments[0] : [].slice.call(arguments)
      , n = fns.length
      ;
    return function(a) {
        return a.map(function(v) {
            for (var i = 0; i < n; ++i) v = fns[i](v);
            return v;
        });
    };
}
