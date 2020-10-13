import clickEntity from './clickEntity'
import getEntityDomFromChild from '../../../../../getEntityDomFromChild'

export default function(editor, selectionModel, commander, typeDefinition) {
  editor.eventEmitter
    .on('textae.editor.editRelation.textBox.click', () =>
      selectionModel.clear()
    )
    .on('textae.editor.editRelation.endpoint.click', (e) => {
      const entity = getEntityDomFromChild(e.target)
      clickEntity(selectionModel, entity, commander, typeDefinition, e)
    })
    .on('textae.editor.editRelation.entity.click', () => editor.focus())
    .on('textae.editor.editRelation.typeValues.click', (e) => {
      const entity = getEntityDomFromChild(e.target)
      clickEntity(selectionModel, entity, commander, typeDefinition, e)
    })
}
