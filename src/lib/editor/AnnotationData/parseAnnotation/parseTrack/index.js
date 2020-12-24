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
  trackNumber = ''
) {
  const result = validateAnnotation(text, rowData)

  importSource(
    [span, entity],
    (src) => translateSpan(src, trackNumber),
    result.accept.denotation,
    'denotation'
  )

  importSource(
    [attribute],
    (src) => translateAttribute(src, trackNumber),
    result.accept.attribute
  )

  importSource(
    [relation],
    (src) => translateRelation(src, trackNumber),
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
    (src) => translateSpan(src, trackNumber),
    result.accept.block,
    'block'
  )

  return result.reject
}
