var AE = require('./array-ext')
  , FE = require('./file-ext')

module.exports = { ArrayExt: AE.ArrayExt
                 , FileExt: FE.FileExt
                 , extendNative: function() {
                       AE.extend(Object.getPrototypeOf(Array))
                       FE.extend(require('fs'))
                   }
                 }
