import validateSpan from './validateSpan'
import validateBoundaryCrossing from './validateBoundaryCrossing'
import validateAttribute from './validateAttribute'
import validateRelation from './validateRelation'
import transformToReferenceObjectError from './transformToReferenceObjectError'

export default function(text, annotation) {
  const resultTypeSet = validateSpan(text, annotation.typesettings)
  const resultDenotation = validateSpan(text, annotation.denotations)

  // Typesets and denotations are both drawn with a span tag,
  // so the boundaries cannot be crossed.
  // The boundary of a typeset and denotation is crossed or not.
  const resultCrossing = validateBoundaryCrossing(
    resultTypeSet.accept,
    resultDenotation.accept
  )
  const resultAttribute = validateAttribute(
    resultCrossing.acceptedDenotations,
    annotation.attributes
  )
  const resultRelation = validateRelation(
    resultCrossing.acceptedDenotations,
    annotation.relations
  )

  return {
    accept: {
      denotation: resultCrossing.acceptedDenotations,
      attribute: resultAttribute.accept,
      relation: resultRelation.accept,
      typeSet: resultCrossing.acceptedTypesettings
    },
    reject: {
      denotationHasLength: resultDenotation.reject.hasLength,
      denotationInText: resultDenotation.reject.inText,
      referencedItems: transformToReferenceObjectError(
        resultAttribute.reject.subj,
        resultRelation.reject.obj,
        resultRelation.reject.subj
      ),
      typeSetHasLength: resultTypeSet.reject.hasLength,
      typeSetInText: resultTypeSet.reject.inText,
      isNotCrossing: resultCrossing.reject.isNotCrossing,
      hasError:
        resultDenotation.hasError ||
        resultAttribute.hasError ||
        resultRelation.hasError ||
        resultTypeSet.hasError ||
        resultCrossing.hasError
    }
  }
}
