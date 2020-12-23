import validateAnnotation from './validateAnnotation'
import importSource from '../importSource'
import translateSpan from './translateSpan'
import translateAttribute from './translateAttribute'
import translateRelation from './translateRelation'
import convertBeginAndEndToInteger from './convertBeginAndEndToInteger'

export default function (
  span,
  entity,
  attribute,
  relation,
  text,
  rowData,
  trackNumber
) {
  const result = validateAnnotation(text, rowData)

  importSource(
    [span, entity],
    (src) => translateSpan(trackNumber, src),
    result.accept.denotation,
    'denotation'
  )

  importSource(
    [attribute],
    (src) => translateAttribute(trackNumber, src),
    result.accept.attribute
  )

  importSource(
    [relation],
    (src) => translateRelation(trackNumber, src),
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

  importSource(
    [span, entity],
    (src) => translateSpan(trackNumber, src),
    result.accept.block,
    'block'
  )

  return result.reject
}
