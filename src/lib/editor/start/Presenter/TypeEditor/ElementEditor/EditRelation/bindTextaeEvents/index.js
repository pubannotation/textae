import clickEntity from './clickEntity'
import getEntityDomFromChild from '../../../../../getEntityDomFromChild'

export default function(editor, selectionModel, commander, typeDefinition) {
  editor.eventEmitter
    .on('textae.editor.editRelation.textBox.click', () =>
      selectionModel.clear()
    )
    .on('textae.editor.editRelation.endpoint.click', (event) => {
      const entity = getEntityDomFromChild(event.target).title
      clickEntity(selectionModel, entity, commander, typeDefinition, event)
    })
    .on('textae.editor.editRelation.entity.click', () => editor.focus())
    .on('textae.editor.editRelation.typeValues.click', (event) => {
      const entity = getEntityDomFromChild(event.target).title
      clickEntity(selectionModel, entity, commander, typeDefinition, event)
    })
}
