import EditRelationHandler from './EditRelationHandler'
import bindMouseEvents from './bindMouseEvents'
import onSelectObjectEntity from './onSelectObjectEntity'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    typeDefinition
  ) {
    this._editor = editor
    this._typeDefinition = typeDefinition
    this._commander = commander
    this._annotationData = annotationData
    this._selectionModel = selectionModel

    this._editor.eventEmitter
      .on('textae.editor.editRelation.entity.click', (e) => {
        if (!selectionModel.entity.some) {
          selectionModel.clear()
          selectionModel.entity.add(e.target.getAttribute('title'))
        } else {
          onSelectObjectEntity(selectionModel, commander, typeDefinition, e)
        }
      })
      .on('textae.editor.editRelation.relatioLabel.click', (e) =>
        e.stopPropagation()
      )
  }

  init() {
    return bindMouseEvents(this._editor)
  }

  get relationHandler() {
    return new EditRelationHandler(
      this._typeDefinition,
      this._commander,
      this._annotationData,
      this._selectionModel
    )
  }
}
