// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var ObjectExt =
{ cmp: cmp
, extend: extend
}

exports.extendNative = function() {
  require('./ext').extend(Object, ObjectExt);
};

extend(module.exports, ObjectExt);

function cmp(a, b) {
  if (a === b) return 0;
  if (a < b) return -1;
  if (a > b) return 1;
  throw new Error('cannot effectively compare values');
}

function extend(a, b) {
  Object.getOwnPropertyNames(b).forEach(function(k) {
    a[k] = b[k];
  });
}
