// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

exports.extend = function(obj, ext) {
  Object.keys(ext).forEach(function(k) {
    if (k in obj.prototype) return; // don't overwrite existing members
    var wrapper = function() {
      var fn = ext[k]
        , args = [].slice.call(arguments)
        ;
      args.unshift(this);
      return fn.apply(this, args);
    };
    Object.defineProperty(obj.prototype, k, {
      get: function() { return wrapper; }
    });
  });
};
