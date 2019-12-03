import Pallet from '../../../../component/Pallet'
import ElementEditor from './ElementEditor'
import cancelSelect from './cancelSelect'
import jsPlumbConnectionClicked from './jsPlumbConnectionClicked'
import bindPalletEvents from './bindPalletEvents'
import releasePalletUpateFunction from './releasePalletUpateFunction'
import rebindPalletUpdateFunction from './rebindPalletUpdateFunction'
import getTypeContainerForCurrentEditMode from './getTypeContainerForCurrentEditMode'

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
      () => cancelSelect(this._pallet, selectionModel)
    )

    this._pallet = new Pallet(editor, originalData, typeDefinition)
    bindPalletEvents(
      this._pallet,
      this._elementEditor,
      autocompletionWs,
      editor,
      commander
    )
    // Bind events to pallet
    // Close pallet when selecting other editor.
    editor.eventEmitter.on('textae.pallet.close', () => this._pallet.hide())
    // Update save config button when changing history and savigng configuration.
    history.on('change', () => this._pallet.updateDisplay())
    dataAccessObject.on('configuration.save', () =>
      this._pallet.updateDisplay()
    )

    this._updatePallet = () => this._pallet.updateDisplay()
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
    // Add the pallet to the editor to prevent focus out of the editor when radio buttnos on the pallet are clicked.
    if (!this._editor[0].querySelector('.textae-editor__type-pallet')) {
      this._editor[0].appendChild(this._pallet.el)
    }

    const typeContainer = getTypeContainerForCurrentEditMode(
      this._elementEditor,
      this._typeDefinition
    )
    this._pallet.show(
      point.point,
      typeContainer,
      this._elementEditor.getHandlerType()
    )

    // Rebinding palette update function to TypeContainer in current editing mode.
    rebindPalletUpdateFunction(typeContainer, this._updatePallet)
    // Save the event emmitter to delete the event listener when the palette is reopend or closed.
    this._typeContainer = typeContainer
  }

  hidePallet() {
    // Release event listeners that bound when opening pallet.
    releasePalletUpateFunction(this._typeContainer, this._updatePallet)
    this._typeContainer = null
    this._pallet.hide()
  }

  changeLabel() {
    this._elementEditor.getHandler().changeLabelHandler(this._autocompletionWs)
  }

  changeTypeOfSelectedElement(newType) {
    this._elementEditor.getHandler().changeTypeOfSelectedElement(newType)
  }

  cancelSelect() {
    cancelSelect(this._pallet, this._selectionModel)
  }

  jsPlumbConnectionClicked(jsPlumbConnection, event) {
    jsPlumbConnectionClicked(this._elementEditor, jsPlumbConnection, event)
  }

  getSelectedIdEditable() {
    return this._elementEditor.getHandler().getSelectedIdEditable()
  }
}
