import setIdPrefixIfExist from './setIdPrefixIfExist'

// Expected relations is an Array of object like { "id": "R1", "pred": "locatedAt", "subj": "E1", "obj": "T1" }.
export default function(prefix, src) {
  prefix = prefix || ''

  return Object.assign({}, src, {
    id: setIdPrefixIfExist(src, prefix),
    subj: prefix + src.subj,
    obj: prefix + src.obj
  })
}
