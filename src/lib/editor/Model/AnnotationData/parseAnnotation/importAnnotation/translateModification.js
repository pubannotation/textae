var setIdPrefixIfExist = require('./setIdPrefixIfExist')

// Expected modifications is an Array of object like { "id": "M1", "pred": "Negation", "obj": "E1" }.
module.exports = function(prefix, src) {
  prefix = prefix || ''
  return _.extend({}, src, {
    id: setIdPrefixIfExist(src, prefix),
    obj: prefix + src.obj
  })
}
