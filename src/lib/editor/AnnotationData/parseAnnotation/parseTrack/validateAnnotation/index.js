import validateTypeSettings from './validateTypeSettings'
import validateAttribute from './validateAttribute'
import validateRelation from './validateRelation'
import transformToReferencedEntitiesError from './transformToReferencedEntitiesError'
import validateDenotation from './validateDenotation'
import validateBlock from './validateBlock'
import debugLogCrossing from './debugLogCrossing'

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

  const [block, errorBlocks] = validateBlock(text, rowData.blocks, spans)

  const [relation, errorRelations] = validateRelation(
    denotation.concat(block),
    rowData.relations
  )

  const [attribute, errorAttributes] = validateAttribute(
    denotation.concat(block).concat(relation),
    rowData.attributes
  )

  debugLogCrossing('TypeSettings', errorTypeSettings)
  debugLogCrossing('Denotations', errorDenotations)
  debugLogCrossing('Blocks', errorBlocks)

  return {
    accept: {
      denotation,
      attribute,
      relation,
      typeSetting,
      block
    },
    reject: {
      wrongRangeDenotations: errorDenotations.get('hasLength'),
      outOfTextDenotations: errorDenotations.get('inText'),
      wrongRangeBlocks: errorBlocks.get('hasLength'),
      outOfTextBlocks: errorBlocks.get('inText'),
      duplicatedRangeBlocks: errorBlocks.get('uniqueRange'),
      wrongRangeTypesettings: errorTypeSettings.get('hasLength'),
      outOfTextTypesettings: errorTypeSettings.get('inText'),
      duplicatedIDs: collectErrors('uniqueID', [errorDenotations, errorBlocks]),
      boundaryCrossingSpans: collectErrors('isNotCrossing', [
        errorTypeSettings,
        errorDenotations,
        errorBlocks
      ]),
      referencedEntitiesDoNotExist: transformToReferencedEntitiesError(
        errorAttributes.get('subject'),
        errorRelations.get('object'),
        errorRelations.get('subject')
      ),
      duplicatedAttributes: errorAttributes.get('unique'),
      hasError:
        errorDenotations.size ||
        errorBlocks.size ||
        errorAttributes.size ||
        errorRelations.size ||
        errorTypeSettings.size
    }
  }
}

function collectErrors(name, errorMaps) {
  return errorMaps.reduce((acc, errorMap) => acc.concat(errorMap.get(name)), [])
}
