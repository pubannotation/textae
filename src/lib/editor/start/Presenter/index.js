import alertifyjs from 'alertifyjs'
import EditMode from './EditMode'
import bindModelChange from './bindModelChange'
import Horizontal from './Horizontal'
import Vertical from './Vertical'
import forwardMethods from './forwardMethods'
import SettingDialog from '../../../component/SettingDialog'
import getIsDelimiterFunc from './getIsDelimiterFunc'

export default class Presenter {
  constructor(
    editor,
    annotationData,
    selectionModel,
    commander,
    spanConfig,
    clipBoard,
    buttonController,
    view,
    originalData,
    autocompletionWs,
    mode
  ) {
    const editMode = new EditMode(
      editor,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      buttonController,
      originalData,
      autocompletionWs
    )

    bindModelChange(editor, editMode, mode)

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

    forwardMethods(this, () => this._editMode.currentEdit, [
      'createSpan',
      'expandSpan',
      'shrinkSpan',
      'showPallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab',
      'editTypeValues',
      'manipulateAttribute'
    ])
    forwardMethods(this, () => this._editMode.stateMachine, [
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
    const command =
      this._commander.factory.createDefaultTypeEntityToSelectedSpansCommand(
        this._annotationData.typeDefinition.denotation.defaultType
      )

    if (!command.isEmpty) {
      this._commander.invoke(command)
    }
  }

  replicate() {
    const isDelimiterFunc = getIsDelimiterFunc(
      this._buttonController,
      this._spanConfig
    )

    if (this._selectionModel.span.single) {
      this._commander.invoke(
        this._commander.factory.replicateSpanCommand(
          this._selectionModel.span.single,
          this._selectionModel.span.single.entities.map((e) => e.typeValues),
          isDelimiterFunc
        )
      )
    } else {
      alertifyjs.warning(
        'You can replicate span annotation when there is only span selected.'
      )
    }
  }

  cancelSelect() {
    this._editMode.cancelSelect()
    // Foucs the editor for ESC key
    this._editor.focus()
  }

  showSettingDialog() {
    new SettingDialog(
      this._annotationData.typeDefinition,
      this._annotationData.typeGap,
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
      this.selectLeftAttributeTab()
    } else {
      this._horizontal.left(shiftKey)
    }
  }

  selectRight(shiftKey) {
    if (this._editMode.isTypeValuesPalletShown) {
      this.selectRightAttributeTab()
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
