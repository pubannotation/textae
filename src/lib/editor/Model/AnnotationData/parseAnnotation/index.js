import validateAnnotation from './validateAnnotation'
import importDenotation from './importAnnotation/denotation'
import importAttribute from './importAnnotation/attribute'
import importRelation from './importAnnotation/relation'
import importModification from './importAnnotation/modification'

export default function(span, entity, relation, modification, paragraph, text, annotation, prefix) {
  var result = validateAnnotation(text, paragraph, annotation)

  importDenotation(
      span,
      entity,
      result.accept.denotation,
      prefix
  )

  // @todo Comment out when attribute container is made.
  // importAttribute(
  //     attribute,
  //     result.accept.attribute,
  //     prefix
  // )

  importRelation(
      relation,
      result.accept.relation,
      prefix
  )

  importModification(
      modification,
      result.accept.modification,
      prefix
  )

  return result.reject
}
