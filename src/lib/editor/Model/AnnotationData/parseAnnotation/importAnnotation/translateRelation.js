var setIdPrefixIfExist = require('./setIdPrefixIfExist')
import _ from 'underscore'

// Expected relations is an Array of object like { "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" }.
module.exports = function(prefix, src) {
  prefix = prefix || ''
  return _.extend({}, src, {
    id: setIdPrefixIfExist(src, prefix),
    subj: prefix + src.subj,
    obj: prefix + src.obj
  })
}
