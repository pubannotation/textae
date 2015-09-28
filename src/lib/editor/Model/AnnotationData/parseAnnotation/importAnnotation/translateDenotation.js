var setIdPrefixIfExist = require('./setIdPrefixIfExist')

// Expected denotations is an Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
module.exports = function(prefix, src) {
  prefix = prefix || ''
  return _.extend({}, src, {
    // Do not convert  string unless id.
    id: setIdPrefixIfExist(src, prefix)
  })
}
