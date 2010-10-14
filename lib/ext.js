exports.extend = function(obj, ext) {
    // FIXME why doesn't this work when the caller supplies
    // a native type's proto for obj? e.g. Array.prototype
    Object.keys(ext).forEach(function(k) {
        if (obj[k]) return; // don't overwrite existing members
        obj[k] = function() {
            var fn = ext[k]
              , args = [].slice.call(arguments)
              ;
            fn.apply(null, args);
        };
    });
};
