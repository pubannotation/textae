import alertifyjs from 'alertifyjs'
import EditModeSwitch from './EditModeSwitch'
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
  #menuState
  #spanConfig
  #functionAvailability
  #clipBoard
  #editModeSwitch
  #horizontal
  #vertical
  #isActive

  /**
   *
   * @param {import('../../StartUpOptions').default} startUpOptions
   */
  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    selectionModel,
    commander,
    spanConfig,
    functionAvailability,
    clipBoard,
    menuState,
    startUpOptions,
    mousePoint,
    editModeState
  ) {
    const editModeSwitch = new EditModeSwitch(
      editorHTMLElement,
      eventEmitter,
      annotationModel,
      selectionModel,
      spanConfig,
      commander,
      menuState,
      startUpOptions,
      mousePoint,
      editModeState
    )

    eventEmitter
      .on('textae-event.annotation-data.all.change', (hasMultiTracks) => {
        if (startUpOptions.isEditMode && hasMultiTracks) {
          alertifyjs.success(
            'track annotations have been merged to root annotations.'
          )
        }

        editModeSwitch.reset()
      })
      .on('textae-event.edit-mode.transition', (mode) => {
        selectionModel.removeAll()

        switch (mode) {
          case MODE.VIEW:
            annotationModel.entityInstanceContainer.clarifyLabelOfAll()
            break
          default:
            annotationModel.entityInstanceContainer.declarifyLabelOfAll()
        }
      })

    this.#editorHTMLElement = editorHTMLElement
    this.#eventEmitter = eventEmitter
    this.#commander = commander
    this.#selectionModel = selectionModel
    this.#annotationModel = annotationModel
    this.#menuState = menuState
    this.#spanConfig = spanConfig
    this.#functionAvailability = functionAvailability
    this.#clipBoard = clipBoard
    this.#editModeSwitch = editModeSwitch
    this.#horizontal = new Horizontal(editorHTMLElement, selectionModel)
    this.#vertical = new Vertical(editorHTMLElement, selectionModel)
    this.#isActive = false

    forwardMethods(this, () => this.#editModeSwitch, [
      'toViewMode',
      'toTermEditMode',
      'toBlockEditMode',
      'toRelationEditMode',
      'toTextEditMode',
      'toggleSimpleMode',
      'changeModeByShortcut'
    ])
    forwardMethods(this, () => this.#editModeSwitch.currentMode, [
      'createSpanWithTouchDevice',
      'expandSpanWithTouchDevice',
      'shrinkSpanWithTouchDevice',
      'editTextWithTouchDevice',
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
    forwardMethods(this, () => this.#menuState, ['toggleButton'])
  }

  removeSelectedElements() {
    const commands = this.#commander.factory.removeSelectedCommand()

    // Select the next element before clear selection.
    this.#horizontal.right(null)

    this.#commander.invoke(commands)
  }

  createEntity() {
    const command =
      this.#commander.factory.createDefaultTypeEntityToSelectedSpansCommand(
        this.#annotationModel.typeDictionary.denotation.defaultType
      )

    if (!command.isEmpty) {
      this.#commander.invoke(command)
    }
  }

  replicate() {
    const isDelimiterFunc = getIsDelimiterFunc(
      this.#menuState,
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
    this.#editModeSwitch.hidePallet()
    this.#selectionModel.removeAll()
    // Focus the editor for ESC key
    this.#editorHTMLElement.focus()
  }

  showSettingDialog() {
    new SettingDialog(
      this.#eventEmitter,
      this.#annotationModel.typeDictionary,
      this.#annotationModel.typeGap,
      this.#annotationModel.textBox,
      this.#spanConfig,
      this.#functionAvailability
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
    if (this.#editModeSwitch.isTypeValuesPalletShown) {
      this.selectLeftAttributeTab()
    } else {
      this.#horizontal.left(shiftKey)
    }
  }

  selectRight(shiftKey) {
    if (this.#editModeSwitch.isTypeValuesPalletShown) {
      this.selectRightAttributeTab()
    } else {
      this.#horizontal.right(shiftKey)
    }
  }

  selectUp() {
    if (this.#editModeSwitch.isEditDenotation) {
      this.#vertical.up()
    }
  }

  selectDown() {
    if (this.#editModeSwitch.isEditDenotation) {
      this.#vertical.down()
    }
  }

  applyTextSelectionWithTouchDevice() {
    if (this.#isActive) {
      this.#editModeSwitch.currentMode.applyTextSelectionWithTouchDevice()
    }
  }
}
