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
  const spans = (rowData.typesettings || [])
    .concat(rowData.denotations || [])
    .concat(rowData.blocks || [])

  const resultTypesetting = validateSpan(text, rowData.typesettings, spans)

  const resultDenotation = validateDenotation(text, rowData.denotations, spans)

  const resultBlock = validateBlock(text, rowData.blocks, spans)

  const resultAttribute = validateAttribute(
    resultDenotation.accept,
    rowData.attributes
  )

  const [relation, errorRelations] = validateRelation(
    resultDenotation.accept,
    rowData.relations
  )

  return {
    accept: {
      denotation: resultDenotation.accept,
      attribute: resultAttribute.accept,
      relation,
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
        )
        .concat(
          resultBlock.reject.boundaryCrossingSpans.map((n) =>
            setSourceProperty(n, 'blocks')
          )
        ),
      referencedEntitiesDoNotExist: transformToReferencedEntitiesError(
        resultAttribute.reject.subj,
        errorRelations.get('object'),
        errorRelations.get('subject')
      ),
      duplicatedAttributes: resultAttribute.reject.duplicatedAttributes,
      hasError:
        resultDenotation.hasError ||
        resultBlock.hasError ||
        resultAttribute.hasError ||
        errorRelations.size ||
        resultTypesetting.hasError
    }
  }
}
