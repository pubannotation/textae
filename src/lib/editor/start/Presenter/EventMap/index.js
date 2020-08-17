import SettingDialog from '../../../../component/SettingDialog'
import createEntityHandler from './createEntityHandler'
import replicateHandler from './replicateHandler'
import Horizontal from './Horizontal'
import Vertical from './Vertical'

export default class {
  constructor(
    editor,
    commander,
    selectionModel,
    typeDefinition,
    displayInstance,
    annotationData,
    buttonController,
    spanConfig,
    clipBoard,
    view,
    typeEditor,
    editMode
  ) {
    this._editor = editor
    this._commander = commander
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
    this._displayInstance = displayInstance
    this._annotationData = annotationData
    this._buttonController = buttonController
    this._spanConfig = spanConfig
    this._clipBoard = clipBoard
    this._view = view
    this._typeEditor = typeEditor
    this._editMode = editMode
    this._horizontal = new Horizontal(editor, selectionModel)
    this._vertical = new Vertical(editor, selectionModel)
  }

  copyEntities() {
    this._clipBoard.copyEntities()
  }

  cutEntities() {
    this._clipBoard.cutEntities()
  }

  removeSelectedElements() {
    const commands = this._commander.factory.removeSelectedComand()

    // Select the next element before clear selection.
    this._horizontal.right(null)

    this._commander.invoke(commands)
  }

  createEntity() {
    createEntityHandler(
      this._commander,
      this._typeDefinition,
      this._editMode.isSimple
    )
  }

  showPallet() {
    this._typeEditor.showPallet()
  }

  replicate() {
    replicateHandler(
      this._commander,
      this._buttonController,
      this._spanConfig,
      this._selectionModel.span.single
    )
  }

  pasteEntities() {
    this._clipBoard.pasteEntities()
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
      this._displayInstance,
      this._view
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
      this._horizontal.left(shiftKey)
    }
  }

  selectRight(shiftKey) {
    if (this._typeEditor.isEntityPalletShown) {
      this._typeEditor.selectRightAttributeTab()
    } else {
      this._horizontal.right(shiftKey)
    }
  }

  selectUp() {
    this._vertical.up()
  }

  selectDown() {
    this._vertical.down()
  }

  toggleSimpleMode() {
    this._editMode.toggleSimple()
  }

  toggleButton(name) {
    this._buttonController.toggle(name)
  }

  changeMode() {
    this._editMode.changeByShortcut()
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
