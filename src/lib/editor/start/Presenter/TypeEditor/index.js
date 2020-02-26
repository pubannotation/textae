import ElementEditor from './ElementEditor'
import jsPlumbConnectionClicked from './jsPlumbConnectionClicked'
import initPallet from './initPallet'
import EntityPallet from '../../../../component/EntityPallet'
import RelationPallet from '../../../../component/RelationPallet'
import bindAttributeTabEvents from './bindAttributeTabEvents'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    pushButtons,
    originalData,
    typeDefinition,
    autocompletionWs
  ) {
    this._editor = editor
    this._typeDefinition = typeDefinition
    this._autocompletionWs = autocompletionWs
    this._selectionModel = selectionModel

    // will init.
    this._elementEditor = new ElementEditor(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      pushButtons,
      typeDefinition
    )

    this.entityPallet = new EntityPallet(
      editor,
      originalData,
      typeDefinition,
      selectionModel.entity
    )
    bindAttributeTabEvents(
      editor.eventEmitter,
      commander,
      selectionModel.entity
    )
    initPallet(
      this.entityPallet,
      editor,
      this,
      commander,
      'entity',
      this._elementEditor.entityHandler
    )

    this._relationPallet = new RelationPallet(
      editor,
      originalData,
      typeDefinition
    )
    initPallet(
      this._relationPallet,
      editor,
      this,
      commander,
      'relation',
      this._elementEditor.relationHandler
    )
  }

  editRelation() {
    this._elementEditor.editRelation()
  }

  editEntity() {
    this._elementEditor.editEntity()
  }

  noEdit() {
    this._elementEditor.noEdit()
  }

  showPallet(point) {
    const pallet = this._getPallet()
    if (pallet) {
      pallet.show(point.point)
    }
  }

  selectLeftAttributeTab() {
    if (this.entityPallet.visibly) {
      this.entityPallet.selectLeftTab()
    }
  }

  selectRightAttributeTab() {
    if (this.entityPallet.visibly) {
      this.entityPallet.selectRightTab()
    }
  }

  get isEntityPalletShown() {
    return this.entityPallet.visibly
  }

  changeLabel() {
    this._elementEditor.getHandler().changeLabelHandler(this.autocompletionWs)
  }

  cancelSelect() {
    const pallet = this._getPallet()
    if (pallet) {
      if (pallet.visibly) {
        pallet.hide()
      } else {
        this._selectionModel.clear()
      }
    }
  }

  jsPlumbConnectionClicked(jsPlumbConnection, event) {
    jsPlumbConnectionClicked(this._elementEditor, jsPlumbConnection, event)
  }

  getSelectedIdEditable() {
    return this._elementEditor.getHandler().selectedIds
  }

  _getPallet() {
    if (this._elementEditor.getHandlerType() == 'entity') {
      return this.entityPallet
    }

    if (this._elementEditor.getHandlerType() == 'relation') {
      return this._relationPallet
    }
  }

  get autocompletionWs() {
    return this._autocompletionWs || this._typeDefinition.autocompletionWs
  }
}
