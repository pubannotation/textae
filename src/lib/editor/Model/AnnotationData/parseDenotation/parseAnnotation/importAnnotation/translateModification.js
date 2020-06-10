import setIdPrefixIfExist from './setIdPrefixIfExist'

// Expected modifications is an Array of object like { "id": "M1", "pred": "Negation", "obj": "E1" }.
export default function(prefix, src) {
  prefix = prefix || ''

  return Object.assign({}, src, {
    id: setIdPrefixIfExist(src, prefix),
    obj: prefix + src.obj
  })
}
