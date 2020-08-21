import clickEntity from './clickEntity'
import getTypeDomOfEntityDom from '../../../../../getTypeDomOfEntityDom'

export default function(editor, selectionModel, commander, typeDefinition) {
  editor.eventEmitter
    .on('textae.editor.editRelation.entity.click', (e) => {
      const entity = e.target
      clickEntity(selectionModel, entity, commander, typeDefinition, e)
    })
    .on('textae.editor.editRelation.type.click', () => editor.focus())
    .on('textae.editor.editRelation.typeValues.click', (e) => {
      const entity = getTypeDomOfEntityDom(e.target).querySelector(
        '.textae-editor__entity'
      )
      clickEntity(selectionModel, entity, commander, typeDefinition, e)
    })
}
