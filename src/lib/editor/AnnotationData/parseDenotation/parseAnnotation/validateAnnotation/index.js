import validateSpan from './validateSpan'
import validateBoundaryCrossing from './validateBoundaryCrossing'
import validateAttribute from './validateAttribute'
import validateRelation from './validateRelation'
import transformToReferencedEntitiesError from './transformToReferencedEntitiesError'

export default function (text, rowData) {
  const resultTypesetting = validateSpan(text, rowData.typesettings)
  const resultDenotation = validateSpan(text, rowData.denotations)

  // Typesets and denotations are both drawn with a span tag,
  // so the boundaries cannot be crossed.
  // The boundary of a typesetting and denotation is crossed or not.
  const resultCrossing = validateBoundaryCrossing(
    resultTypesetting.accept,
    resultDenotation.accept
  )
  const resultAttribute = validateAttribute(
    resultCrossing.acceptedDenotations,
    rowData.attributes
  )
  const resultRelation = validateRelation(
    resultCrossing.acceptedDenotations,
    rowData.relations
  )

  return {
    accept: {
      denotation: resultCrossing.acceptedDenotations,
      attribute: resultAttribute.accept,
      relation: resultRelation.accept,
      typeSetting: resultCrossing.acceptedTypesettings,
      block: rowData.blocks || []
    },
    reject: {
      wrongRangeDenotations: resultDenotation.reject.wrongRange,
      outOfTextDenotations: resultDenotation.reject.outOfText,
      wrongRangeTypesettings: resultTypesetting.reject.wrongRange,
      outOfTextTypesettings: resultTypesetting.reject.outOfText,
      boundaryCrossingSpans: resultCrossing.reject.boundaryCrossingSpans,
      referencedEntitiesDoNotExist: transformToReferencedEntitiesError(
        resultAttribute.reject.subj,
        resultRelation.reject.obj,
        resultRelation.reject.subj
      ),
      duplicatedAttributes: resultAttribute.reject.duplicatedAttributes,
      hasError:
        resultDenotation.hasError ||
        resultAttribute.hasError ||
        resultRelation.hasError ||
        resultTypesetting.hasError ||
        resultCrossing.hasError
    }
  }
}
