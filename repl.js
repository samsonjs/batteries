#!/usr/bin/env node

require('./lib/index').requireEverything().extendNative()
require('repl').start()
