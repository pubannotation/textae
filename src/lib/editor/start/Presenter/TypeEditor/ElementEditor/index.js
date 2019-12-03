import EditRelation from './EditRelation'
import EditEntity from './EditEntity'
import unbindAllMouseEventhandler from './unbindAllMouseEventhandler'
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
    typeDefinition,
    cancelSelect
  ) {
    this._handler = 'default'

    this._editEntity = new EditEntity(
      editor,
      annotationData,
      selectionModel,
      commander,
      pushButtons,
      typeDefinition,
      spanConfig,
      cancelSelect
    )

    this._editRelation = new EditRelation(
      editor,
      annotationData,
      selectionModel,
      commander,
      typeDefinition,
      cancelSelect
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

  noEdit() {
    unbindAllMouseEventhandler(this._editor)
    this._setHandlerType('default')
  }

  editEntity() {
    unbindAllMouseEventhandler(this._editor)

    this._editEntity.init()
    this._setHandlerType('entity')
  }

  editRelation() {
    unbindAllMouseEventhandler(this._editor)

    this._editRelation.init()
    this._setHandlerType('relation')
  }
}
