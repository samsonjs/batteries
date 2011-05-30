// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var MathExt =
{ avg: avg
, sum: sum
};

exports.extendNative = function() {
  Math.avg = avg;
  Math.sum = sum;
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
