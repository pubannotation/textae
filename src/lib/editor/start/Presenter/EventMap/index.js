import SettingDialog from '../../../../component/SettingDialog'
import ClipBoardHandler from './ClipBoardHandler'
import createEntityHandler from './createEntityHandler'
import replicateHandler from './replicateHandler'
import selectLeft from './selectLeft'
import selectRight from './selectRight'
import selectUpperLayer from './selectUpperLayer'
import selectLowerLayer from './selectLowerLayer'
import toggleSimpleMode from './toggleSimpleMode'
import toggleDetectBoundaryMode from './toggleDetectBoundaryMode'
import toggleInstaceRelation from './toggleInstaceRelation'

export default class {
  constructor(
    commander,
    selectionModel,
    typeDefinition,
    displayInstance,
    annotationData,
    buttonController,
    spanConfig,
    clipBoard,
    typeEditor,
    editor,
    editMode
  ) {
    this._clipBoardHandler = new ClipBoardHandler(
      commander,
      selectionModel,
      clipBoard
    )
    this._commander = commander
    this._editor = editor
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
    this._displayInstance = displayInstance
    this._typeEditor = typeEditor
    this._annotationData = annotationData
    this._buttonController = buttonController
    this._spanConfig = spanConfig
    this._editMode = editMode
  }

  copyEntities() {
    this._clipBoardHandler.copyEntities()
  }

  removeSelectedElements() {
    const commands = this._commander.factory.removeSelectedComand()

    // Select the next element before clear selection.
    selectRight(this._editor[0], this._selectionModel, null)

    this._commander.invoke(commands)
  }

  createEntity() {
    createEntityHandler(this._commander, this._typeDefinition, () =>
      this._displayInstance.notifyNewInstance()
    )
  }

  showPallet() {
    this._typeEditor.showPallet()
  }

  replicate() {
    replicateHandler(
      this._commander,
      this._annotationData,
      this._buttonController.pushButtons,
      this._spanConfig,
      this._selectionModel.span.single()
    )
  }

  pasteEntities() {
    this._clipBoardHandler.pasteEntities()
  }

  changeLabel() {
    this._typeEditor.changeLabel()
  }

  manipulateAttribute(number, shiftKey) {
    this._typeEditor.manipulateAttribute(number, shiftKey)
  }

  cancelSelect() {
    this._typeEditor.cancelSelect()
    // Foucs the editor for ESC key
    this._editor.focus()
  }

  showSettingDialog() {
    new SettingDialog(
      this._editor,
      this._typeDefinition,
      this._displayInstance
    ).open()
  }

  select() {
    this._editor[0].classList.add('textae-editor--active')
  }

  unselect() {
    this._editor[0].classList.remove('textae-editor--active')
    this._editor.eventEmitter.emit('textae.editor.unselect')
  }

  selectLeft(shiftKey) {
    if (this._typeEditor.isEntityPalletShown) {
      this._typeEditor.selectLeftAttributeTab()
    } else {
      selectLeft(this._editor[0], this._selectionModel, shiftKey)
    }
  }

  selectRight(shiftKey) {
    if (this._typeEditor.isEntityPalletShown) {
      this._typeEditor.selectRightAttributeTab()
    } else {
      selectRight(this._editor[0], this._selectionModel, shiftKey)
    }
  }

  selectUp() {
    selectUpperLayer(this._editor[0], this._selectionModel)
  }

  selectDown() {
    selectLowerLayer(this._editor[0], this._selectionModel)
  }

  toggleSimpleMode() {
    toggleSimpleMode(this._buttonController.pushButtons, this._editMode)
  }

  toggleDetectBoundaryMode() {
    toggleDetectBoundaryMode(this._buttonController.pushButtons)
  }

  toggleInstaceRelation() {
    toggleInstaceRelation(this._editMode)
  }

  toViewMode() {
    this._editMode.pushView()
  }

  toTermMode() {
    this._editMode.pushTerm()
  }

  toRelationMode() {
    this._editMode.pushRelation()
  }
}
