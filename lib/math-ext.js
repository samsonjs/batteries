exports.extendNative = function() {
    Math.sum = sum;
    Math.avg = avg;
};

exports.sum = sum;
function sum() {
    var nums = Array.isArray(arguments[0]) ? arguments[0] : arguments
      , i = nums.length
      , sum = 0
      ;
    while (i--) sum += arguments[i];
    return sum;
}

exports.avg = avg;
function avg() {
    var nums = Array.isArray(arguments[0]) ? arguments[0] : arguments;
    return sum.call(this, nums) / nums.length;
}
