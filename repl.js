#!/usr/bin/env node

var vm = require('vm')
  , repl
  , InitCode = 'require("batteries").requireEverything(global).extendNative(global);'
  ;

try {
  repl = require('repl-edit').startRepl();
}
catch (e) {
  var replModule = require('repl');
  replModule.start();
  repl = replModule.repl;
}

repl.on('reset', function(context) {
  vm.runInContext(InitCode, context, 'batteries')
})
