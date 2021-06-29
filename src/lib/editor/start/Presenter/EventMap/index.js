import SettingDialog from '../../../../component/SettingDialog'
import createEntityHandler from './createEntityHandler'
import replicateHandler from './replicateHandler'
import Horizontal from './Horizontal'
import Vertical from './Vertical'
import forwardMethods from './forwardMethods'

export default class EventMap {
  constructor(
    editor,
    commander,
    selectionModel,
    annotationData,
    buttonController,
    spanConfig,
    clipBoard,
    view,
    editMode
  ) {
    this._editor = editor
    this._commander = commander
    this._selectionModel = selectionModel
    this._annotationData = annotationData
    this._buttonController = buttonController
    this._spanConfig = spanConfig
    this._clipBoard = clipBoard
    this._view = view
    this._editMode = editMode
    this._horizontal = new Horizontal(editor, selectionModel)
    this._vertical = new Vertical(editor, selectionModel)

    forwardMethods(this, () => this._editMode, [
      'createSpan',
      'expandSpan',
      'showPallet',
      'editTypeValues',
      'manipulateAttribute',
      'toggleSimpleMode',
      'changeModeByShortcut',
      'toViewMode',
      'toTermMode',
      'toBlockMode',
      'toRelationMode'
    ])
    forwardMethods(this, () => this._clipBoard, [
      'copyEntities',
      'cutEntities',
      'pasteEntities'
    ])
    forwardMethods(this, () => this._buttonController, ['toggleButton'])
  }

  removeSelectedElements() {
    const commands = this._commander.factory.removeSelectedComand()

    // Select the next element before clear selection.
    this._horizontal.right(null)

    this._commander.invoke(commands)
  }

  createEntity() {
    createEntityHandler(this._commander, this._annotationData.typeDefinition)
  }

  replicate() {
    replicateHandler(
      this._commander,
      this._buttonController,
      this._spanConfig,
      this._selectionModel.span.single
    )
  }

  cancelSelect() {
    this._editMode.cancelSelect()
    // Foucs the editor for ESC key
    this._editor.focus()
  }

  showSettingDialog() {
    new SettingDialog(
      this._editor,
      this._annotationData.typeDefinition,
      this._annotationData.entityGap,
      this._annotationData.textBox
    ).open()
  }

  select() {
    this._editor[0].classList.add('textae-editor--active')
  }

  unselect() {
    this._editor[0].classList.remove('textae-editor--active')
    this._editor.eventEmitter.emit('textae-event.editor.unselect')
  }

  selectLeft(shiftKey) {
    if (this._editMode.isTypeValuesPalletShown) {
      this._editMode.selectLeftAttributeTab()
    } else {
      this._horizontal.left(shiftKey)
    }
  }

  selectRight(shiftKey) {
    if (this._editMode.isTypeValuesPalletShown) {
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
}
