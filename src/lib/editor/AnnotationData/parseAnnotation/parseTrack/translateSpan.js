import setIdPrefixIfExist from './setIdPrefixIfExist'
import convertBeginAndEndToInteger from './convertBeginAndEndToInteger'

// Expected denotations is an Array of object like { "id": "T1", "span": { "begin": 19, "end": 49 }, "obj": "Cell" }.
export default function (src, prefix) {
  return {
    ...src,
    id: setIdPrefixIfExist(src, prefix),
    span: convertBeginAndEndToInteger(src.span)
  }
}
