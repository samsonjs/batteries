#!/usr/bin/env node

var batteries = require('./lib');

batteries
  .requireEverything()
  .extendNative();

try {
  require('repl-edit').startRepl();
}
catch (e) {
  require('repl').start();
}
