import EditRelation from './EditRelation'
import EditEntity from './EditEntity'
import EditAttribute from './EditAttribute'
import DeleteAttribute from './DeleteAttribute'
import EditBlock from './EditBlock'
import DefaultHandler from './DefaultHandler'

// Provide handlers to edit elements according to an edit mode.
export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    typeDefinition,
    entityPallet,
    relationPallet
  ) {
    this._handler = 'default'

    const editAttribute = new EditAttribute(
      commander,
      editor,
      annotationData,
      selectionModel,
      entityPallet
    )
    const deleteAttribute = new DeleteAttribute(commander, annotationData)

    this._editEntity = new EditEntity(
      editor,
      annotationData,
      selectionModel,
      commander,
      buttonController,
      typeDefinition,
      spanConfig,
      editAttribute,
      deleteAttribute,
      entityPallet
    )

    this._editBlock = new EditBlock(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController
    )

    this._editRelation = new EditRelation(
      editor,
      annotationData,
      selectionModel,
      commander,
      typeDefinition,
      relationPallet
    )

    this._editor = editor
    this._listeners = []
  }

  getHandlerType() {
    return this._handler
  }

  getHandler() {
    switch (this._handler) {
      case 'entity':
        return this._editEntity.handler
      case 'relation':
        return this._editRelation.handler
      default:
        return new DefaultHandler()
    }
  }

  get entityHandler() {
    return this._editEntity.handler
  }

  get relationHandler() {
    return this._editRelation.handler
  }

  noEdit() {
    this._unbindAllMouseEventhandler()
    this._handler = 'default'
  }

  editEntity() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editEntity.init()
    this._handler = 'entity'
  }

  editBlock() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editBlock.init()
    this._handler = 'block'
  }

  editRelation() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editRelation.init()
    this._handler = 'relation'
  }

  _unbindAllMouseEventhandler() {
    for (const listner of this._listeners) {
      listner.destroy()
    }
    this._listeners = []
  }
}
