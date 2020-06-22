import validateDenotation from './validateDenotation'
import validateAttribute from './validateAttribute'
import validateRelation from './validateRelation'
import transformToReferenceObjectError from './transformToReferenceObjectError'

export default function(text, paragraph, annotation) {
  const resultDenotation = validateDenotation(
    text,
    paragraph,
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
      denotationInParagraph: resultDenotation.reject.inParagraph,
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
