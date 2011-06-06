// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

// TODO
// - reverse
// - unpack
// - sha1

var batteries = require('./')
  , StringExt = { cmp: cmp }
  ;

exports.extendNative = function() {
  batteries.object.extendPrototype(String, StringExt);
};

batteries.object.extend(exports, StringExt);

function cmp(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
