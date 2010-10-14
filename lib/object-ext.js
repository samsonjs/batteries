var ext = exports.ObjectExt = {

    cmp: function(a, b) {
        if (a === b) return 0;
        if (a < b) return -1;
        if (a > b) return 1;
        throw new Error('cannot effectively compare values');
    }

};
