// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var batteries = module.exports
  , exts = []
  ;

ext('array');
ext('date');
ext('fs');
ext('math');
ext('object');
ext('range');
ext('repr');
ext('string');

function ext(name) {
  exts.push(name);
  defineLazyProperty(batteries, name, function() { return require('./' + name); });
};

function defineLazyProperty(obj, name, getter) {
  Object.defineProperty(obj, name, {
    configurable: true
  , enumerable: true

    // Call the getter and overwrite this property with one that returns
    // that value directly.
  , get: function() {
      var val = getter();
      Object.defineProperty(batteries, name, { value: val });
      return val;
    }

  });
}

// ES5 strict mode compatible
function ensureContext(context) {
  return context || this || (1, eval)('this');
}

// TODO figure out how to extend native types in the REPL
batteries.extendNative = function(context) {
  context = ensureContext(context)
  exts.forEach(function(name) {
    var ext = batteries[name];
    if (typeof ext.extendNative === 'function') {
      ext.extendNative(context);
    }
  });

  return batteries;


};
