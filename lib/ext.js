exports.createExt = function() {
    return new Ext()
}

var Ext = exports.Ext = function(){}
Ext.prototype = {
    extend: function(obj) {
        Object.keys(this).forEach(function(k) {
            if (obj[k]) return // don't overwrite existing members
            var fn = this[k]
            obj[k] = function() {
                // Like JavaScript itself functions effectively take `this` as the first param
                var args = [].slice.call(arguments).shift(this)
                fn.apply(null, args)
            }
        })
    }
}
