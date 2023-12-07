import alertifyjs from 'alertifyjs'
import EditMode from './EditMode'
import Horizontal from './Horizontal'
import Vertical from './Vertical'
import forwardMethods from '../../forwardMethods'
import SettingDialog from '../../../component/SettingDialog'
import getIsDelimiterFunc from './getIsDelimiterFunc'
import { MODE } from '../../../MODE'

export default class Presenter {
  #editorHTMLElement
  #eventEmitter
  #commander
  #selectionModel
  #annotationModel
  #controlViewModel
  #spanConfig
  #clipBoard
  #editMode
  #horizontal
  #vertical
  #isActive

  /**
   *
   * @param {import('../../HTMLInlineOptions').HTMLInlineOption} inlineOptions
   */
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    commander,
    spanConfig,
    clipBoard,
    controlViewModel,
    inlineOptions,
    functionAvailability,
    mousePoint
  ) {
    const editMode = new EditMode(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      spanConfig,
      commander,
      controlViewModel,
      inlineOptions,
      functionAvailability,
      mousePoint
    )

    eventEmitter
      .on('textae-event.annotation-data.all.change', (_, hasMultiTracks) => {
        if (inlineOptions.isEditMode && hasMultiTracks) {
          alertifyjs.success(
            'track annotations have been merged to root annotations.'
          )
        }

        editMode.reset()
      })
      .on('textae-event.edit-mode.transition', (mode) => {
        switch (mode) {
          case MODE.VIEW:
            annotationModel.entity.clarifyLabelOfAll()
            break
          default:
            annotationModel.entity.declarifyLabelOfAll()
        }
      })

    this.#editorHTMLElement = editorHTMLElement
    this.#eventEmitter = eventEmitter
    this.#commander = commander
    this.#selectionModel = selectionModel
    this.#annotationModel = annotationModel
    this.#controlViewModel = controlViewModel
    this.#spanConfig = spanConfig
    this.#clipBoard = clipBoard
    this.#editMode = editMode
    this.#horizontal = new Horizontal(editorHTMLElement, selectionModel)
    this.#vertical = new Vertical(editorHTMLElement, selectionModel)
    this.#isActive = false

    forwardMethods(this, () => this.#editMode, [
      'toViewMode',
      'toTermMode',
      'toBlockMode',
      'toRelationMode',
      'toggleSimpleMode',
      'changeModeByShortcut'
    ])
    forwardMethods(this, () => this.#editMode.currentEdit, [
      'createSpan',
      'expandSpan',
      'shrinkSpan',
      'showPallet',
      'selectLeftAttributeTab',
      'selectRightAttributeTab',
      'editProperties',
      'manipulateAttribute'
    ])
    forwardMethods(this, () => this.#clipBoard, [
      'copyEntitiesToLocalClipboard',
      'copyEntitiesToSystemClipboard',
      'cutEntitiesToLocalClipboard',
      'cutEntitiesToSystemClipboard',
      'pasteEntitiesFromLocalClipboard',
      'pasteEntitiesFromSystemClipboard'
    ])
    forwardMethods(this, () => this.#controlViewModel, ['toggleButton'])
  }

  removeSelectedElements() {
    const commands = this.#commander.factory.removeSelectedComand()

    // Select the next element before clear selection.
    this.#horizontal.right(null)

    this.#commander.invoke(commands)
  }

  createEntity() {
    const command =
      this.#commander.factory.createDefaultTypeEntityToSelectedSpansCommand(
        this.#annotationModel.typeDefinition.denotation.defaultType
      )

    if (!command.isEmpty) {
      this.#commander.invoke(command)
    }
  }

  replicate() {
    const isDelimiterFunc = getIsDelimiterFunc(
      this.#controlViewModel,
      this.#spanConfig
    )

    if (this.#selectionModel.span.single) {
      this.#commander.invoke(
        this.#commander.factory.replicateSpanCommand(
          this.#selectionModel.span.single,
          this.#selectionModel.span.single.entities.map((e) => e.typeValues),
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
    this.#editMode.cancelSelect()
    // Focus the editor for ESC key
    this.#editorHTMLElement.focus()
  }

  showSettingDialog() {
    new SettingDialog(
      this.#annotationModel.typeDefinition,
      this.#annotationModel.typeGap,
      this.#annotationModel.textBox
    ).open()
  }

  get isActive() {
    return this.#isActive
  }

  activate() {
    this.#editorHTMLElement.classList.add('textae-editor--active')
    this.#isActive = true
  }

  deactivate() {
    this.#editorHTMLElement.classList.remove('textae-editor--active')
    this.#eventEmitter.emit('textae-event.editor.unselect')
    this.#isActive = false
  }

  selectLeft(shiftKey) {
    if (this.#editMode.isTypeValuesPalletShown) {
      this.selectLeftAttributeTab()
    } else {
      this.#horizontal.left(shiftKey)
    }
  }

  selectRight(shiftKey) {
    if (this.#editMode.isTypeValuesPalletShown) {
      this.selectRightAttributeTab()
    } else {
      this.#horizontal.right(shiftKey)
    }
  }

  selectUp() {
    if (this.#editMode.isEditDenotation) {
      this.#vertical.up()
    }
  }

  selectDown() {
    if (this.#editMode.isEditDenotation) {
      this.#vertical.down()
    }
  }

  applyTextSelection() {
    if (this.#isActive) {
      this.#editMode.currentEdit.applyTextSelection()
    }
  }

  focusDenotation(denotationID) {
    if (!this.#annotationModel.entity.hasDenotation(denotationID)) {
      throw new Error(`Denotation ${denotationID} not found`)
    }

    this.toTermMode()
    const { span } = this.#annotationModel.entity.get(denotationID)
    span.focus()
  }
}
