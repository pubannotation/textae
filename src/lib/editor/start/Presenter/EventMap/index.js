import SettingDialog from '../../../../component/SettingDialog'
import createEntityHandler from './createEntityHandler'
import replicateHandler from './replicateHandler'
import Horizontal from './Horizontal'
import Vertical from './Vertical'

export default class EventMap {
  constructor(
    editor,
    commander,
    selectionModel,
    typeDefinition,
    annotationData,
    buttonController,
    spanConfig,
    clipBoard,
    view,
    editMode,
    entityGap
  ) {
    this._editor = editor
    this._commander = commander
    this._selectionModel = selectionModel
    this._typeDefinition = typeDefinition
    this._annotationData = annotationData
    this._buttonController = buttonController
    this._spanConfig = spanConfig
    this._clipBoard = clipBoard
    this._view = view
    this._editMode = editMode
    this._horizontal = new Horizontal(editor, selectionModel)
    this._vertical = new Vertical(editor, selectionModel)
    this._entityGap = entityGap
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
    createEntityHandler(this._commander, this._typeDefinition)
  }

  showPallet() {
    this._editMode.showPallet()
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
    this._editMode.changeLabel()
  }

  manipulateAttribute(number, shiftKey) {
    this._editMode.manipulateAttribute(number, shiftKey)
  }

  cancelSelect() {
    this._editMode.cancelSelect()
    // Foucs the editor for ESC key
    this._editor.focus()
  }

  showSettingDialog() {
    new SettingDialog(
      this._editor,
      this._typeDefinition,
      this._entityGap,
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
    if (this._editMode.isEntityAndAttributePalletShown) {
      this._editMode.selectLeftAttributeTab()
    } else {
      this._horizontal.left(shiftKey)
    }
  }

  selectRight(shiftKey) {
    if (this._editMode.isEntityAndAttributePalletShown) {
      this._editMode.selectRightAttributeTab()
    } else {
      this._horizontal.right(shiftKey)
    }
  }

  selectUp() {
    if (this._editMode.isEditDenotation) {
      this._vertical.up()
    }
  }

  selectDown() {
    if (this._editMode.isEditDenotation) {
      this._vertical.down()
    }
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

  toBlockMode() {
    this._editMode.pushBlock()
  }

  toRelationMode() {
    this._editMode.pushRelation()
  }
}
