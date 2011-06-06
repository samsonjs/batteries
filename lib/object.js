// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var ObjectExt =
{ cmp: cmp
, extend: extend
, extendPrototype: extendPrototype
}

exports.extendNative = function() {
  extendPrototype(Object, ObjectExt);
};

extend(module.exports, ObjectExt);

function cmp(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  if (a === b) return 0;
  throw new Error('cannot effectively compare values');
}

function extend(a, b) {
  Object.getOwnPropertyNames(b).forEach(function(k) {
    a[k] = b[k];
  });
}

function extendPrototype(obj, ext) {
  Object.keys(ext).forEach(function(k) {
    // TODO remove this and just warn? ... no good solution for conflicts, needs a human
    if (k in obj.prototype) return; // don't overwrite existing members
    var val = ext[k];
    if (typeof val === 'function') {
      val = methodWrapper(val);
    }
    Object.defineProperty(obj.prototype, k, { value: val });
  });
}

// Make a wrapper than passes `this` as the first argument, Python style. All
// extension functions that can extend native types must follow this convention.
function methodWrapper(fn) {
  return function() {
    var args = [].slice.call(arguments);
    args.unshift(this);
    return fn.apply(this, args);
  };
}
