exports.Range = Range;
function Range(start, length) {
    this.start = start;
    this.length = length;
};

Range.prototype.inRange = function(val) {
    if (this.test) return this.test(val);
    return val >= this.start && val <= this.start + this.length;
};

Range.prototype.toArray = function(nth) {
    var a = []
      , i = this.length
      ;
    nth = nth || this.nth;
    if (nth)
        while (i--) a[i] = nth(i);
    else
        while (i--) a[i] = this.start + i;
    return a;
};
