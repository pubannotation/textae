import validateAnnotation from './validateAnnotation'
import importSource from '../importSource'
import translateDenotation from './translateDenotation'
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
    (src) => translateDenotation(prefix, src),
    result.accept.denotation,
    'denotation span'
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
    'style span'
  )

  return result.reject
}
