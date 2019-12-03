import ElementEditor from './ElementEditor'
import cancelSelect from './cancelSelect'
import jsPlumbConnectionClicked from './jsPlumbConnectionClicked'
import initPallet from './initPallet'
import EntityPallet from '../../../../component/EntityPallet'
import RelationPallet from '../../../../component/RelationPallet'

export default class {
  constructor(
    editor,
    history,
    annotationData,
    selectionModel,
    spanConfig,
    commander,
    pushButtons,
    originalData,
    typeDefinition,
    dataAccessObject,
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
      typeDefinition,
      () => this.cancelSelect()
    )

    this._entityPallet = new EntityPallet(editor, originalData, typeDefinition)
    initPallet(
      this._entityPallet,
      editor,
      autocompletionWs,
      commander,
      history,
      dataAccessObject,
      typeDefinition.entity,
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
      autocompletionWs,
      commander,
      history,
      dataAccessObject,
      typeDefinition.relation,
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

  hidePallet() {
    const pallet = this._getPallet()
    if (pallet) {
      pallet.hide()
    }
  }

  changeLabel() {
    this._elementEditor.getHandler().changeLabelHandler(this._autocompletionWs)
  }

  changeTypeOfSelectedElement(newType) {
    this._elementEditor.getHandler().changeTypeOfSelectedElement(newType)
  }

  cancelSelect() {
    const pallet = this._getPallet()
    if (pallet) {
      cancelSelect(pallet, this._selectionModel)
    }
  }

  jsPlumbConnectionClicked(jsPlumbConnection, event) {
    jsPlumbConnectionClicked(this._elementEditor, jsPlumbConnection, event)
  }

  getSelectedIdEditable() {
    return this._elementEditor.getHandler().getSelectedIdEditable()
  }

  _getPallet() {
    if (this._elementEditor.getHandlerType() == 'entity') {
      return this._entityPallet
    }

    if (this._elementEditor.getHandlerType() == 'relation') {
      return this._relationPallet
    }
  }
}
