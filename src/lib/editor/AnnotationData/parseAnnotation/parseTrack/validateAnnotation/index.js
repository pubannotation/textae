import validateTypeSettings from './validateTypeSettings'
import validateAttribute from './validateAttribute'
import validateRelation from './validateRelation'
import transformToReferencedEntitiesError from './transformToReferencedEntitiesError'
import validateDenotation from './validateDenotation'
import validateBlock from './validateBlock'
import debugLogCrossing from './debugLogCrossing'
import { collectErrors } from './ErrorMap'

export default function (text, rowData, spans) {
  // Typesets and denotations are both drawn with a span tag,
  // so the boundaries cannot be crossed.
  // The boundary of a typesetting and denotation is crossed or not.
  // Merge type settings and denotations

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
      wrongRangeDenotations: errorDenotations.getErrors('hasLength'),
      outOfTextDenotations: errorDenotations.getErrors('inText'),
      wrongRangeBlocks: errorBlocks.getErrors('hasLength'),
      outOfTextBlocks: errorBlocks.getErrors('inText'),
      duplicatedRangeBlocks: errorBlocks.getErrors('uniqueRange'),
      wrongRangeTypesettings: errorTypeSettings.getErrors('hasLength'),
      outOfTextTypesettings: errorTypeSettings.getErrors('inText'),
      duplicatedIDs: collectErrors('uniqueID', [errorDenotations, errorBlocks]),
      boundaryCrossingSpans: collectErrors('isNotCrossing', [
        errorTypeSettings,
        errorDenotations,
        errorBlocks
      ]),
      referencedEntitiesDoNotExist: transformToReferencedEntitiesError(
        errorAttributes.getErrors('subject'),
        errorRelations.getErrors('object'),
        errorRelations.getErrors('subject')
      ),
      duplicatedAttributes: errorAttributes.getErrors('unique'),
      hasError:
        errorDenotations.size ||
        errorBlocks.size ||
        errorAttributes.size ||
        errorRelations.size ||
        errorTypeSettings.size
    }
  }
}
