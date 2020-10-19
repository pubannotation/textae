import clickEntity from './clickEntity'
import getEntityDomFromChild from '../../../../../getEntityDomFromChild'

export default class MouseEventHandler {
  constructor(editor, selectionModel, commander, typeDefinition) {
    this._editor = editor
    this._selectionModel = selectionModel
    this._commander = commander
    this._typeDefinition = typeDefinition
  }

  textBoxClicked() {
    this._selectionModel.clear()
  }

  endpointClicked(e) {
    const entity = getEntityDomFromChild(e.target).title
    clickEntity(
      this._selectionModel,
      entity,
      this._commander,
      this._typeDefinition,
      e
    )
  }

  entityClicked() {
    this._editor.focus()
  }

  typeValuesClicked(e) {
    const entity = getEntityDomFromChild(e.target).title
    clickEntity(
      this._selectionModel,
      entity,
      this._commander,
      this._typeDefinition,
      e
    )
  }
}
