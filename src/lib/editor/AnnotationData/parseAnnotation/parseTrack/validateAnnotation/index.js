import validateTypeSettings from './validateTypeSettings'
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

  const [typeSetting, errorTypeSettings] = validateTypeSettings(
    text,
    rowData.typesettings,
    spans
  )

  const [denotation, errorDenotations] = validateDenotation(
    text,
    rowData.denotations,
    spans
  )

  const resultBlock = validateBlock(text, rowData.blocks, spans)

  const [attribute, errorAttributes] = validateAttribute(
    denotation,
    rowData.attributes
  )

  const [relation, errorRelations] = validateRelation(
    denotation,
    rowData.relations
  )

  return {
    accept: {
      denotation,
      attribute,
      relation,
      typeSetting,
      block: resultBlock.accept
    },
    reject: {
      wrongRangeDenotations: errorDenotations.get('hasLength'),
      outOfTextDenotations: errorDenotations.get('inText'),
      duplicatedIDDenotations: errorDenotations.get('uniqueID'),
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
          errorDenotations
            .get('isNotCrossing')
            .map((n) => setSourceProperty(n, 'denotations'))
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
        errorDenotations.size ||
        resultBlock.hasError ||
        errorAttributes.size ||
        errorRelations.size ||
        errorTypeSettings.size
    }
  }
}
