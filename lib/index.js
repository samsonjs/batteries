// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var fs = require('fs')
  , batteries = module.exports
  , exts = []
  ;

fs.readdirSync(__dirname).forEach(function (file) {
  file = file.replace('.js', '');
  if (file !== 'index') {
    exts.push(file);
    defineLazyProperty(batteries, file, function() { return require('./' + file); });
  }
});

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

var NodeModules = ( 'assert buffer child_process crypto dgram dns events freelist'
                  + ' fs http https net os path querystring readline repl'
                  + ' string_decoder util url'
                  ).split(' ');

batteries.requireEverything = function(context) {
  context = ensureContext(context);
  NodeModules.forEach(function(name) {
    defineLazyProperty(context, name, function() { return require(name); });
  });

  return batteries;
};
