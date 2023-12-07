import Dialog from '../Dialog'
import boundaryCrossingSpansTemplate from './boundaryCrossingSpansTemplate'
import duplicatedAttributesTemplate from './duplicatedAttributesTemplate'
import duplicatedIDsTemplate from './duplicatedIDsTemplate'
import duplicateRangeBlocksTemplate from './duplicateRangeBlocksTemplate'
import outOfTextBlocksTemplate from './outOfTextBlocksTemplate'
import outOfTextDenotationsTemplate from './outOfTextDenotationsTemplate'
import outOfTextTypesettingsTemplate from './outOfTextTypesettingsTemplate'
import referencedEntitiesDoNotExistTemplate from './referencedEntitiesDoNotExistTemplate'
import wrongRangeBlocksTemplate from './wrongRangeBlocksTemplate'
import wrongRangeDenotationsTemplate from './wrongRangeDenotationsTemplate'
import wrongRangeTypesettingsTemplate from './wrongRangeTypesettingsTemplate'

export default class ValidationDialog extends Dialog {
  constructor(rejects) {
    const contentHtml = rejects
      .map(
        (
          {
            name,
            wrongRangeDenotations,
            outOfTextDenotations,
            wrongRangeBlocks,
            outOfTextBlocks,
            duplicatedRangeBlocks,
            wrongRangeTypesettings,
            outOfTextTypesettings,
            duplicatedIDs,
            boundaryCrossingSpans,
            referencedEntitiesDoNotExist,
            duplicatedAttributes
          },
          index
        ) => {
          return `
    ${
      index === 1
        ? `
      <div class="textae-editor__validate-dialog__content">
        <h1>Track annotations will be merged to the root annotations.</h1>
      </div>`
        : ''
    }
    <div class="textae-editor__validate-dialog__content">
      <h2>${name}</h2>
      ${wrongRangeDenotationsTemplate(wrongRangeDenotations)}
      ${outOfTextDenotationsTemplate(outOfTextDenotations)}
      ${wrongRangeBlocksTemplate(wrongRangeBlocks)}
      ${outOfTextBlocksTemplate(outOfTextBlocks)}
      ${duplicateRangeBlocksTemplate(duplicatedRangeBlocks)}
      ${wrongRangeTypesettingsTemplate(wrongRangeTypesettings)}
      ${outOfTextTypesettingsTemplate(outOfTextTypesettings)}
      ${duplicatedIDsTemplate(duplicatedIDs)}
      ${boundaryCrossingSpansTemplate(boundaryCrossingSpans)}
      ${referencedEntitiesDoNotExistTemplate(referencedEntitiesDoNotExist)}
      ${duplicatedAttributesTemplate(duplicatedAttributes)}
    </div>
    `
        }
      )
      .join('\n')

    super('The following erroneous annotations ignored', contentHtml, {
      maxWidth: 900
    })
  }
}
