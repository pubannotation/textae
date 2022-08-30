import alertifyjs from 'alertifyjs'
import EditMode from './EditMode'
import Horizontal from './Horizontal'
import Vertical from './Vertical'
import forwardMethods from '../../forwardMethods'
import SettingDialog from '../../../component/SettingDialog'
import getIsDelimiterFunc from './getIsDelimiterFunc'
import { MODE } from '../../../MODE'

export default class Presenter {
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationData,
    selectionModel,
    commander,
    spanConfig,
    clipBoard,
    controlViewModel,
    autocompletionWs,
    mode
  ) {
    const editMode = new EditMode(
      editorHTMLElement,
      eventEmitter,
      annotationData,
      selectionModel,
      spanConfig,
      commander,
      controlViewModel,
      autocompletionWs
    )

    eventEmitter
      .on('textae-event.annotation-data.all.change', (_, hasMultiTracks) => {
        if (mode !== 'edit') {
          editMode.forView()
        } else {
          if (hasMultiTracks) {
            alertifyjs.success(
              'track annotations have been merged to root annotations.'
            )
          }
          editMode.forEditable()
        }
      })
      .on('textae-event.edit-mode.transition', (mode) => {
        switch (mode) {
          case MODE.VIEW_WITHOUT_RELATION:
          case MODE.VIEW_WITH_RELATION:
            annotationData.entity.clarifyLabelOfAll()
            break
          default:
            annotationData.entity.declarifyLabelOfAll()
        }
      })

    this._editorHTMLElement = editorHTMLElement
    this._eventEmitter = eventEmitter
    this._commander = commander
    this._selectionModel = selectionModel
    this._annotationData = annotationData
    this._controlViewModel = controlViewModel
    this._spanConfig = spanConfig
    this._clipBoard = clipBoard
    this._editMode = editMode
    this._horizontal = new Horizontal(editorHTMLElement, selectionModel)
    this._vertical = new Vertical(editorHTMLElement, selectionModel)
    this._isActive = false

    forwardMethods(this, () => this._editMode.currentEdit, [
      'createSpan',
      'expandSpan',
      'shrinkSpan',
      'showPallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab',
      'editProperties',
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
      'copyEntitiesToLocalClipboard',
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToLocalClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromLocalClipboard',
      'pasteEntitiesFromSystemClipboard'
    ])
    forwardMethods(this, () => this._controlViewModel, ['toggleButton'])
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
      this._controlViewModel,
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
    this._editorHTMLElement.focus()
  }

  showSettingDialog() {
    new SettingDialog(
      this._annotationData.typeDefinition,
      this._annotationData.typeGap,
      this._annotationData.textBox
    ).open()
  }

  get isActive() {
    return this._isActive
  }

  active() {
    this._editorHTMLElement.classList.add('textae-editor--active')
    this._isActive = true
  }

  deactive() {
    this._editorHTMLElement.classList.remove('textae-editor--active')
    this._eventEmitter.emit('textae-event.editor.unselect')
    this._isActive = false
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

  applyTextSelection() {
    if (this._isActive) {
      this._editMode.currentEdit.applyTextSelection()
    }
  }
}
