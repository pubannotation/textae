import validateDenotation from './validateDenotation'
import validateAttribute from './validateAttribute'
import validateRelation from './validateRelation'
import validateModificatian from './validateModificatian'

export default function(text, paragraph, annotation) {
  const resultDenotation = validateDenotation(
      text,
      paragraph,
      annotation.denotations
    ),
    resultAttribute = validateAttribute(
      resultDenotation.accept,
      annotation.attributes
    ),
    resultRelation = validateRelation(
      resultDenotation.accept,
      annotation.relations
    ),
    resultModification = validateModificatian(
      resultDenotation.accept,
      resultRelation.accept,
      annotation.modifications
    )

  return {
    accept: {
      denotation: resultDenotation.accept,
      attribute: resultAttribute.accept,
      relation: resultRelation.accept,
      modification: resultModification.accept
    },
    reject: {
      denotationHasLength: resultDenotation.reject.hasLength,
      denotationInText: resultDenotation.reject.inText,
      denotationInParagraph: resultDenotation.reject.inParagraph,
      denotationIsNotCrossing: resultDenotation.reject.isNotCrossing,
      attributeObj: resultRelation.reject.obj,
      attributeSubj: resultRelation.reject.subj,
      relationObj: resultRelation.reject.obj,
      relationSubj: resultRelation.reject.subj,
      modification: resultModification.reject.modification,
      hasError: resultDenotation.hasError ||
        resultAttribute.hasError ||
        resultRelation.hasError ||
        resultModification.hasError
    }
  }
}
