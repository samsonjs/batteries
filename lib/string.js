// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

// TODO
// - reverse
// - unpack
// - sha1

var StringExt = { cmp: cmp };

exports.extendNative = function() {
  require('./ext').extend(String, StringExt);
};

require('./object').extend(exports, StringExt);

function cmp(a, b) {
  if (a > b) return 1;
  if (a < b) return -1;
  return 0;
}
