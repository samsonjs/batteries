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

batteries.requireEverything = function(context) {
  context = ensureContext(context);
  context.assert = require('assert');
  context.buffer = require('buffer');
  context.child_process = require('child_process');
  context.crypto = require('crypto');
  context.dgram = require('dgram');
  context.dns = require('dns');
  context.events = require('events');
  context.freelist = require('freelist');
  context.fs = require('fs');
  context.http = require('http');
  context.https = require('https');
  context.net = require('net');
  context.os = require('os');
  context.path = require('path');
  context.querystring = require('querystring');
  context.readline = require('readline');
  context.repl = require('repl');
  context.string_decoder = require('string_decoder');
  context.util = require('util');
  context.url = require('url');

  return batteries;
};
