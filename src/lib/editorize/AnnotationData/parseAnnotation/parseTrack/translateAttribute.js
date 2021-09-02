import setIdPrefixIfExist from './setIdPrefixIfExist'

// Expected denotations is an Array of object like { "id": "A1", "subj": "T1", "pred": "example_predicate_1", "obj": "attr1" }.
export default function (src, prefix) {
  return {
    ...src,
    id: setIdPrefixIfExist(src, prefix),
    subj: prefix + src.subj,
    obj: src.obj
  }
}
