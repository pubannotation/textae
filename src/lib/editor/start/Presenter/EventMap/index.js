import SettingDialog from '../../../../component/SettingDialog'
import ClipBoardHandler from './ClipBoardHandler'
import createEntityHandler from './createEntityHandler'
import replicateHandler from './replicateHandler'
import ModificationHandler from './ModificationHandler'
import createAttribute from './createAttribute'
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
      annotationData,
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
    this._modificationHandler = new ModificationHandler(
      commander,
      buttonController.pushButtons,
      typeEditor
    )
    this._settingDialog = new SettingDialog(
      editor,
      typeDefinition,
      displayInstance
    )
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

  showPallet(point) {
    this._typeEditor.showPallet(point)
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

  cancelSelect() {
    this._typeEditor.cancelSelect()
    // Foucs the editor for ESC key
    this._editor.focus()
  }

  negation() {
    this._modificationHandler.negation()
  }

  speculation() {
    this._modificationHandler.speculation()
  }

  createAttribute() {
    createAttribute(this._commander)
  }

  showSettingDialog() {
    this._settingDialog.open()
  }

  select() {
    this._editor[0].classList.add('textae-editor--active')
  }

  unselect() {
    this._editor[0].classList.remove('textae-editor--active')
    this._editor.eventEmitter.emit('textae.editor.unselect')
  }

  selectLeft(option) {
    selectLeft(this._editor[0], this._selectionModel, option.shiftKey)
  }

  selectRight(option) {
    selectRight(this._editor[0], this._selectionModel, option.shiftKey)
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
