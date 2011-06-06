// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var strftime = require('strftime').strftime
  , batteries = require('./')
  , DateExt = { format: format }
  ;

exports.extendNative = function() {
  batteries.object.extendPrototype(Date, DateExt);
};

batteries.object.extend(exports, DateExt);

function format(d, fmt, locale) {
  return strftime.call(null, fmt, d, locale);
}
