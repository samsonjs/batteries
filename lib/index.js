// batteries
// Copyright 2010 - 2011 Sami Samhuri <sami@samhuri.net>

var ArrayExt = require('./array')
  , DateExt = require('./date')
  , FileExt = require('./file')
  , MathExt = require('./math')
  , ObjectExt = require('./object')
  , StringExt = require('./string')
  , Range = require('./range')
  , repr = require('./repr').repr
  ;

module.exports =
{ array: ArrayExt
, date: DateExt
, fs: FileExt
, math: MathExt
, object: ObjectExt
, string: StringExt
, Range: Range
, repr: repr

, extendNative: function() {
    // Extend native types
    ArrayExt.extendNative();
    DateExt.extendNative();
    MathExt.extendNative();

    // Extend Node
    FileExt.extendNative(require('fs'));

    global['Range'] = Range;
    global['repr'] = repr;

    return module.exports;
  }

, requireEverything: function() {
    assert = require('assert');
    buffer = require('buffer');
    child_process = require('child_process');
    crypto = require('crypto');
    dgram = require('dgram');
    dns = require('dns');
    events = require('events');
    freelist = require('freelist');
    fs = require('fs');
    http = require('http');
    https = require('https');
    net = require('net');
    os = require('os');
    path = require('path');
    querystring = require('querystring');
    readline = require('readline');
    repl = require('repl');
    string_decoder = require('string_decoder');
    util = require('util');
    url = require('url');

    return module.exports;
  }

};
