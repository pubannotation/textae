import ElementEditor from './ElementEditor'
import initPallet from './initPallet'
import EntityPallet from '../../../../../component/EntityPallet'
import RelationPallet from '../../../../../component/RelationPallet'
import bindAttributeTabEvents from './bindAttributeTabEvents'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    buttonController,
    originalData,
    typeDefinition,
    autocompletionWs
  ) {
    this._editor = editor
    this._typeDefinition = typeDefinition
    this._autocompletionWsFromParams = autocompletionWs
    this._selectionModel = selectionModel

    // will init.
    this._entityPallet = new EntityPallet(
      editor,
      originalData,
      typeDefinition,
      selectionModel.entity
    )
    this._relationPallet = new RelationPallet(
      editor,
      originalData,
      typeDefinition
    )

    this._elementEditor = new ElementEditor(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      typeDefinition,
      this._entityPallet,
      this._relationPallet
    )

    bindAttributeTabEvents(
      editor.eventEmitter,
      commander,
      selectionModel.entity,
      this._entityPallet
    )

    initPallet(
      this._entityPallet,
      editor,
      commander,
      'entity',
      this._elementEditor.entityHandler,
      () => this._autocompletionWs
    )

    initPallet(
      this._relationPallet,
      editor,
      commander,
      'relation',
      this._elementEditor.relationHandler,
      () => this._autocompletionWs
    )
  }

  editRelation() {
    this.cancelSelect()
    this._elementEditor.editRelation()
  }

  editBlock() {
    this.cancelSelect()
    this._elementEditor.editBlock()
  }

  editEntity() {
    this.cancelSelect()
    this._elementEditor.editEntity()
  }

  noEdit() {
    this.cancelSelect()
    this._elementEditor.noEdit()
  }

  showPallet() {
    const pallet = this._getPallet()
    if (pallet) {
      pallet.show()
    }
  }

  selectLeftAttributeTab() {
    if (this._entityPallet.visibly) {
      this._entityPallet.selectLeftTab()
    }
  }

  selectRightAttributeTab() {
    if (this._entityPallet.visibly) {
      this._entityPallet.selectRightTab()
    }
  }

  get isEntityPalletShown() {
    return this._entityPallet.visibly
  }

  changeLabel() {
    this._elementEditor.getHandler().changeLabelHandler(this._autocompletionWs)
  }

  manipulateAttribute(number, shiftKey) {
    this._elementEditor.getHandler().manipulateAttribute(number, shiftKey)
  }

  cancelSelect() {
    const pallet = this._getPallet()
    if (pallet) {
      pallet.hide()
    }

    this._selectionModel.clear()
  }

  jsPlumbConnectionClicked(jsPlumbConnection, event) {
    // A relation is drawn by a jsPlumbConnection.
    // The EventHandlar for clieck event of jsPlumbConnection.
    this._elementEditor
      .getHandler()
      .jsPlumbConnectionClicked(jsPlumbConnection, event)
  }

  _getPallet() {
    if (this._elementEditor.handlerType == 'entity') {
      return this._entityPallet
    }

    if (this._elementEditor.handlerType == 'relation') {
      return this._relationPallet
    }
  }

  get _autocompletionWs() {
    return (
      this._autocompletionWsFromParams || this._typeDefinition.autocompletionWs
    )
  }
}
