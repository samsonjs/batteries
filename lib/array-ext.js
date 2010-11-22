exports.extendNative = function() {
    Object.keys(ArrayExt).forEach(function(k) {
        if (Array.prototype[k]) return; // don't overwrite existing members
        Array.prototype[k] = function() {
            var fn = ArrayExt[k]
              , args = [].slice.call(arguments)
              ;
            args.shift(this);
            fn.apply(ArrayExt, args);
        };
    });
};

var ArrayToString = [].toString();

var ArrayExt = exports.ArrayExt = {
    
// abbrev

    // [1,2,3,4,5].at(-1) => 5
    at: function(a, i) {
        if (i >= 0) return a[i];
        return a[a.length + i];
    }

    // TODO make this work for non-array objects
  , compact: function(a) {
        var b = []
          , i = a.length
          ;
        while (i--) {
            if (a[i] !== null && a[i] !== undefined) b[i] = a[i];
        }
        return b;
    }

  , first: function(a) { return a[0]; }
  
    // Based on underscore.js's flatten
  , flatten: function(a) {
        return a.reduce(function(initial, elem) {
            if (elem && elem.flatten) initial = initial.concat(elem.flatten());
            else initial.push(elem);
            return initial;
        });
    }

  , grep: function(a, regex) {
        return a.filter(function(v) { return regex.match(v); });
    }

  , last: function(a) { return a[a.length-1]; }

  , max: function(a) {
        return a.reduce(function(max, v) { return v > max ? v : max });
    }

  , min: function(a) {
        return a.reduce(function(min, v) { return v < min ? v : min });
    }

    // pack
    // partition

  , pluck: function(a /* , key paths, ... */) {
        var args = [].slice.call(arguments, 1);
        args.unshift(a);
        return pluck.apply(null, args);
    }

  , sortBy: function(arr, keyPath) {
        return arr.slice().sort(function(a, b) {
            var propA = drillInto(a)
              , propB = drillInto(b);
            if (propA < propB) return -1
            if (propA > propB) return 1
            return 0
        });
    }

  , toString: function(a) {
        return '[' + ArrayToString.call(a) + ']';
    }

  , unique: function(a) {
        var b = []
          , i = 0
          , n = a.length
          ;
        for (; i < n; ++i) {
            if (b.indexOf(a[i]) === -1) b.push(a[i]);
        }
        return b;
    }
};


// pluck

function getProp(thing, key) {
    if (thing === null || thing === undefined) return thing
    var prop = thing[key]
    return typeof prop === 'function' ? prop.call(thing) : prop
}

function drillInto(thing, keyPath) {
    return keyPath.split('.').reduce(function(memo, key) {
        return getProp(memo, key)
    }, thing)
}

function mapInto(thing /* , key paths, ... */) {
    var keyPaths = [].slice.call(arguments, 1)
    return keyPaths.map(function(keyPath) {
        return drillInto(thing, keyPath)
    })
}

function pluck(things /* , key paths, ... */) {
    var keyPaths = [].slice.call(arguments, 1)
    return things.map(function(thing) {
        var results = mapInto.apply(null, [thing].concat(keyPaths))
        if (results.length > 1) return results
        return results[0]
    })
}
