import EditRelation from './EditRelation'
import EditEntity from './EditEntity'
import getHandler from './getHandler'

// Provide handlers to edit elements according to an edit mode.
export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    pushButtons,
    typeDefinition
  ) {
    this._handler = 'default'

    this._editEntity = new EditEntity(
      editor,
      annotationData,
      selectionModel,
      commander,
      pushButtons,
      typeDefinition,
      spanConfig
    )

    this._editRelation = new EditRelation(
      editor,
      annotationData,
      selectionModel,
      commander,
      typeDefinition
    )

    this._editor = editor
  }

  _setHandlerType(handler) {
    this._handler = handler
  }

  getHandlerType() {
    return this._handler
  }

  getHandler() {
    return getHandler(this._handler, this._editEntity, this._editRelation)
  }

  get entityHandler() {
    return this._editEntity.entityHandler()
  }

  get relationHandler() {
    return this._editRelation.handlers
  }

  noEdit() {
    this._unbindAllMouseEventhandler()
    this._setHandlerType('default')
  }

  editEntity() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editEntity.init()
    this._setHandlerType('entity')
  }

  editRelation() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editRelation.init()
    this._setHandlerType('relation')
  }

  _unbindAllMouseEventhandler() {
    for (const listner of this._listeners || []) {
      listner.destroy()
    }
  }
}
