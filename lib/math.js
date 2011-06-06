// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var MathExt =
{ avg: avg
, sum: sum
};

var batteries = require('./');

batteries.object.extend(module.exports, MathExt);

exports.extendNative = function() {
  batteries.object.extend(Math, MathExt);
};

function sum() {
  var nums = Array.isArray(arguments[0]) ? arguments[0] : arguments
    , i = nums.length
    , sum = 0
    ;
  while (i--) sum += arguments[i];
  return sum;
}

function avg() {
  var nums = Array.isArray(arguments[0]) ? arguments[0] : arguments;
  return sum.call(this, nums) / nums.length;
}
