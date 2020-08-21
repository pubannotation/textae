import clickEntity from './clickEntity'

export default function(editor, selectionModel, commander, typeDefinition) {
  editor.eventEmitter
    .on('textae.editor.editRelation.entity.click', (e) => {
      const entity = e.target
      clickEntity(selectionModel, entity, commander, typeDefinition, e)
    })
    .on('textae.editor.editRelation.type.click', () => editor.focus())
}
