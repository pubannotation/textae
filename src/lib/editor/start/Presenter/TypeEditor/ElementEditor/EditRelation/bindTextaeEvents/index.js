import onSelectObjectEntity from './onSelectObjectEntity'

export default function(editor, selectionModel, commander, typeDefinition) {
  editor.eventEmitter.on('textae.editor.editRelation.entity.click', (e) => {
    if (!selectionModel.entity.some) {
      selectionModel.clear()
      selectionModel.entity.add(e.target.getAttribute('title'))
    } else {
      onSelectObjectEntity(selectionModel, commander, typeDefinition, e)
    }
  })
}
