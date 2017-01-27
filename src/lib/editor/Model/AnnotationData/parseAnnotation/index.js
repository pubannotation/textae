import validateAnnotation from './validateAnnotation'
import importDenotation from './importAnnotation/denotation'
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
