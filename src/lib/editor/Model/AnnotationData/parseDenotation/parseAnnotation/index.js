import validateAnnotation from './validateAnnotation'
import importSource from '../importSource'
import translateDenotation from './translateDenotation'
import translateAttribute from './translateAttribute'
import translateRelation from './translateRelation'

export default function(
  span,
  entity,
  attribute,
  relation,
  text,
  annotation,
  prefix
) {
  const result = validateAnnotation(text, annotation)

  importSource(
    [span, entity],
    (src) => translateDenotation(prefix, src),
    result.accept.denotation
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

  return result.reject
}
