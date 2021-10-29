import validateTypeSettings from './validateTypeSettings'
import validateAttribute from './validateAttribute'
import validateRelation from './validateRelation'
import transformToReferencedEntitiesError from './transformToReferencedEntitiesError'
import validateDenotation from './validateDenotation'
import validateBlock from './validateBlock'
import debugLogCrossing from './debugLogCrossing'
import { collectErrors } from './ErrorMap'
import getAllSpansIn from '../../getAllSpansIn'

export default function (text, spanOfAllTracks, rowData) {
  const [typeSetting, errorTypeSettings] = validateTypeSettings(
    text,
    rowData.typesettings,
    spanOfAllTracks
  )

  const spansInTrack = getAllSpansIn(rowData)

  const [denotation, errorDenotations] = validateDenotation(
    text,
    rowData.denotations,
    spanOfAllTracks,
    spansInTrack
  )

  const [block, errorBlocks] = validateBlock(
    text,
    rowData.blocks,
    spanOfAllTracks,
    spansInTrack
  )

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
