import validateAnnotation from './validateAnnotation'
import importSource from '../importSource'
import translateSpan from './translateSpan'
import translateAttribute from './translateAttribute'
import translateRelation from './translateRelation'
import convertBeginAndEndToInteger from './convertBeginAndEndToInteger'

export default function(
  span,
  entity,
  attribute,
  relation,
  text,
  rowData,
  prefix
) {
  const result = validateAnnotation(text, rowData)

  importSource(
    [span, entity],
    (src) => translateSpan(prefix, src),
    result.accept.denotation,
    'denotation'
  )

  importSource(
    [attribute],
    (src) => translateAttribute(prefix, src),
    result.accept.attribute
  )

  importSource(
    [relation],
    (src) => translateRelation(prefix, src),
    result.accept.relation
  )

  importSource(
    [span],
    (src) => {
      return Object.assign({}, src, {
        span: convertBeginAndEndToInteger(src.span)
      })
    },
    result.accept.typeSetting,
    'typesetting'
  )

  return result.reject
}
