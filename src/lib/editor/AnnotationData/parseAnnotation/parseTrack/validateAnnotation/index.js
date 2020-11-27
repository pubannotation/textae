import validateSpan from './validateSpan'
import validateAttribute from './validateAttribute'
import validateRelation from './validateRelation'
import transformToReferencedEntitiesError from './transformToReferencedEntitiesError'
import validateDenotation from './validateDenotation'
import validateBlock from './validateBlock'
import setSourceProperty from './setSourceProperty'

export default function (text, rowData) {
  // Typesets and denotations are both drawn with a span tag,
  // so the boundaries cannot be crossed.
  // The boundary of a typesetting and denotation is crossed or not.
  // Merge type settings and denotations
  const spans = (rowData.typesettings || []).concat(rowData.denotations || [])

  const resultTypesetting = validateSpan(text, rowData.typesettings, spans)

  const resultDenotation = validateDenotation(text, rowData.denotations, spans)

  const resultBlock = validateBlock(text, rowData.blocks, rowData.blocks)

  const resultAttribute = validateAttribute(
    resultDenotation.accept,
    rowData.attributes
  )

  const resultRelation = validateRelation(
    resultDenotation.accept,
    rowData.relations
  )

  return {
    accept: {
      denotation: resultDenotation.accept,
      attribute: resultAttribute.accept,
      relation: resultRelation.accept,
      typeSetting: resultTypesetting.accept,
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
      boundaryCrossingSpans: resultTypesetting.reject.boundaryCrossingSpans
        .map((n) => setSourceProperty(n, 'typesettings'))
        .concat(
          resultDenotation.reject.boundaryCrossingSpans.map((n) =>
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
        resultTypesetting.hasError
    }
  }
}
