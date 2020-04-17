import setIdPrefixIfExist from './setIdPrefixIfExist'

// Expected denotations is an Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
export default function(prefix, src) {
  prefix = prefix || ''

  return Object.assign({}, src, {
    // Do not convert  string unless id.
    id: setIdPrefixIfExist(src, prefix)
  })
}
