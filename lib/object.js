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

function compact(o) {
  return reduce(o, function(p, key) {
    var val = o[key];
    if (val !== null && val !== undefined) p[key] = val;
    return p;
  }, {});
}

function extend(a, b) {
  Object.getOwnPropertyNames(b).forEach(function(k) {
    a[k] = b[k];
  });
  return a;
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

function flatten(o) {
  return reduce(o, function(p, key) {
    var val = o[key];
    if (val && !Array.isArray(val) && typeof val.flatten === 'function') {
      extend(p, val.flatten());
    }
    else if (typeof val === 'object' && !Array.isArray(val)) {
      extend(p, flatten(val));
    }
    else {
      p[key] = val;
    }
    return p;
  });
}
function grep(o, regex) {

  return reduce(o, function(p, key) {
    if (regex.test(key)) p[key] = o[key];
    return p;
  }, {});
}

function grepValues(o, regex) {
  return reduce(o, function(p, key) {
    var val = o[key];
    if (regex.test(val)) p[key] = val;
    return p;
  });
}

function map(o, fn) {
  return reduce(o, function(p, key) {
    p[key] = fn(o[key], p, o);
    return p;
  });
}

function reduce(o, fn, initial) {
  var keys = Object.getOwnPropertyNames(o || {});
  return keys.reduce(fn, initial || {});
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
