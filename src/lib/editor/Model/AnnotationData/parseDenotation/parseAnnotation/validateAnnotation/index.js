import validateAnnotationWithSpan from './validateAnnotationWithSpan'
import validateAttribute from './validateAttribute'
import validateRelation from './validateRelation'
import transformToReferenceObjectError from './transformToReferenceObjectError'

export default function(text, annotation) {
  const resultDenotation = validateAnnotationWithSpan(
    text,
    annotation.denotations
  )
  const resultAttribute = validateAttribute(
    resultDenotation.accept,
    annotation.attributes
  )
  const resultRelation = validateRelation(
    resultDenotation.accept,
    annotation.relations
  )

  return {
    accept: {
      denotation: resultDenotation.accept,
      attribute: resultAttribute.accept,
      relation: resultRelation.accept
    },
    reject: {
      denotationHasLength: resultDenotation.reject.hasLength,
      denotationInText: resultDenotation.reject.inText,
      denotationIsNotCrossing: resultDenotation.reject.isNotCrossing,
      referencedItems: transformToReferenceObjectError(
        resultAttribute.reject.subj,
        resultRelation.reject.obj,
        resultRelation.reject.subj
      ),
      hasError:
        resultDenotation.hasError ||
        resultAttribute.hasError ||
        resultRelation.hasError
    }
  }
}
