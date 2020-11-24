import EditRelation from './EditRelation'
import EditDenotation from './EditDenotation'
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
    this._handlerType = 'default'

    const editAttribute = new EditAttribute(
      commander,
      editor,
      annotationData,
      selectionModel,
      entityPallet
    )
    const deleteAttribute = new DeleteAttribute(commander, annotationData)

    this._editDenotation = new EditDenotation(
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

  get handlerType() {
    return this._handlerType
  }

  getHandler() {
    switch (this._handlerType) {
      case 'denotation':
        return this._editDenotation.handler
      case 'relation':
        return this._editRelation.handler
      default:
        return new DefaultHandler()
    }
  }

  get denotationHandler() {
    return this._editDenotation.handler
  }

  get relationHandler() {
    return this._editRelation.handler
  }

  noEdit() {
    this._unbindAllMouseEventhandler()
    this._handlerType = 'default'
  }

  editDenotation() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editDenotation.init()
    this._handlerType = 'denotation'
  }

  editBlock() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editBlock.init()
    this._handlerType = 'block'
  }

  editRelation() {
    this._unbindAllMouseEventhandler()
    this._listeners = this._editRelation.init()
    this._handlerType = 'relation'
  }

  _unbindAllMouseEventhandler() {
    for (const listner of this._listeners) {
      listner.destroy()
    }
    this._listeners = []
  }
}
