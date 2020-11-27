import validateSpan from './validateSpan'
import validateAttribute from './validateAttribute'
import validateRelation from './validateRelation'
import transformToReferencedEntitiesError from './transformToReferencedEntitiesError'
import validateDenotation from './validateDenotation'
import validateBlock from './validateBlock'
import setSourceProperty from './setSourceProperty'
import IsNotCrossingValidation from './IsNotCrossingValidation'

export default function (text, rowData) {
  const resultTypesetting = validateSpan(text, rowData.typesettings)
  const resultDenotation = validateDenotation(text, rowData.denotations)
  const resultBlock = validateBlock(text, rowData.blocks)

  // Typesets and denotations are both drawn with a span tag,
  // so the boundaries cannot be crossed.
  // The boundary of a typesetting and denotation is crossed or not.
  // Merge type settings and denotations
  const spans = resultTypesetting.accept.concat(resultDenotation.accept)

  const typesettingsValidation = new IsNotCrossingValidation(
    resultTypesetting.accept,
    spans
  )
  const denotationsValidation = new IsNotCrossingValidation(
    resultDenotation.accept,
    spans
  )

  const resultAttribute = validateAttribute(
    denotationsValidation.validNodes,
    rowData.attributes
  )
  const resultRelation = validateRelation(
    denotationsValidation.validNodes,
    rowData.relations
  )

  return {
    accept: {
      denotation: denotationsValidation.validNodes,
      attribute: resultAttribute.accept,
      relation: resultRelation.accept,
      typeSetting: typesettingsValidation.validNodes,
      block: resultBlock.accept
    },
    reject: {
      wrongRangeDenotations: resultDenotation.reject.wrongRange,
      outOfTextDenotations: resultDenotation.reject.outOfText,
      duplicatedIDDenotations: resultDenotation.reject.duplicatedID,
      wrongRangeBlocks: resultBlock.reject.wrongRange,
      outOfTextBlocks: resultBlock.reject.outOfText,
      duplicatedIDBlocks: resultBlock.reject.duplicatedID,
      duplicatedRangeBlocks: resultBlock.reject.duplicatedRange,
      wrongRangeTypesettings: resultTypesetting.reject.wrongRange,
      outOfTextTypesettings: resultTypesetting.reject.outOfText,
      boundaryCrossingSpans: typesettingsValidation.invalidNodes
        .map((n) => setSourceProperty(n, 'typesettings'))
        .concat(
          denotationsValidation.invalidNodes.map((n) =>
            setSourceProperty(n, 'denotations')
          )
        ),
      referencedEntitiesDoNotExist: transformToReferencedEntitiesError(
        resultAttribute.reject.subj,
        resultRelation.reject.obj,
        resultRelation.reject.subj
      ),
      duplicatedAttributes: resultAttribute.reject.duplicatedAttributes,
      hasError:
        resultDenotation.hasError ||
        resultBlock.hasError ||
        resultAttribute.hasError ||
        resultRelation.hasError ||
        resultTypesetting.hasError ||
        typesettingsValidation.invalid ||
        denotationsValidation.invalid
    }
  }
}
