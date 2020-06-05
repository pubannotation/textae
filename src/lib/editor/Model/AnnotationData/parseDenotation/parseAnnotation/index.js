import validateAnnotation from './validateAnnotation'
import importDenotation from './importAnnotation/denotation'
import importAttribute from './importAnnotation/attribute'
import importRelation from './importAnnotation/relation'

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

  importDenotation(span, entity, result.accept.denotation, prefix)

  importAttribute(attribute, result.accept.attribute, prefix)

  importRelation(relation, result.accept.relation, prefix)

  return result.reject
}
