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

  const [typeSetting, errorTypeSettings] = validateSpan(
    text,
    rowData.typesettings,
    spans
  )

  const resultDenotation = validateDenotation(text, rowData.denotations, spans)

  const resultBlock = validateBlock(text, rowData.blocks, spans)

  const [attribute, errorAttributes] = validateAttribute(
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
      attribute,
      relation,
      typeSetting,
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
      wrongRangeTypesettings: errorTypeSettings.get('hasLength'),
      outOfTextTypesettings: errorTypeSettings.get('inText'),
      boundaryCrossingSpans: errorTypeSettings
        .get('isNotCrossing')
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
        errorAttributes.get('subject'),
        errorRelations.get('object'),
        errorRelations.get('subject')
      ),
      duplicatedAttributes: errorAttributes.get('unique'),
      hasError:
        resultDenotation.hasError ||
        resultBlock.hasError ||
        errorAttributes.size ||
        errorRelations.size ||
        errorTypeSettings.size
    }
  }
}
