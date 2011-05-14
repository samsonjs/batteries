var ArrayExt = require('./array-ext')
  , DateExt = require('./date-ext')
  , FileExt = require('./file-ext')
  , MathExt = require('./math-ext')
  , ObjectExt = require('./object-ext')
  , StringExt = require('./string-ext')
  , Range = require('./range')
  , repr = require('./repr').repr
  , fuse = require('./fuse')
  ;

module.exports = { ArrayExt: ArrayExt.ArrayExt
                 , DateExt: DateExt.DateExt
                 , FileExt: FileExt.FileExt
                 , MathExt: MathExt.MathExt
                 , ObjectExt: ObjectExt.ObjectExt
                 , StringExt: StringExt.StringExt
                 , extendNative: function() {
                       // Extend native types
                       ArrayExt.extendNative();
                       DateExt.extendNative();
                       MathExt.extendNative();
                       fuse.extendArray();

                       // Extend Node
                       FileExt.extend(require('fs'));
                       
                       global['Range'] = Range;
                       global['repr'] = repr;
                       
                       return module.exports;
                   }
                 , requireEverything: function() {
                       assert = require('assert');
                       child_process = require('child_process');
                       crypto = require('crypto');
                       dgram = require('dgram');
                       dns = require('dns');
                       events = require('events');
                       fs = require('fs');
                       http = require('http');
                       net = require('net');
                       path = require('path');
                       querystring = require('querystring');
                       repl = require('repl');
                       util = require('util');
                       url = require('url');
                       
                       return module.exports;
                   }
                 };
