import alertifyjs from 'alertifyjs'
import SettingDialog from '../../../component/SettingDialog'
import forwardMethods from '../../forwardMethods'
import removeAllMarks from '../removeAllMarks'
import getIsDelimiterFunc from './getIsDelimiterFunc'
import Horizontal from './Horizontal'
import Vertical from './Vertical'

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
  #horizontal
  #vertical
  #isActive
  #currentEditMode

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
    currentEditMode
  ) {
    eventEmitter.on('textae-event.edit-mode.transition', () => {
      // Reset label clarification
      annotationModel.entityInstanceContainer.declarifyLabelOfAll()

      // Clear selection of spans and entities
      selectionModel.removeAll()

      // Update selected text
      removeAllMarks(
        editorHTMLElement.querySelector('.textae-editor__text-box')
      )
      eventEmitter.emit('textae-event.editor.selected-text.change')
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
    this.#horizontal = new Horizontal(editorHTMLElement, selectionModel)
    this.#vertical = new Vertical(editorHTMLElement, selectionModel)
    this.#isActive = false
    this.#currentEditMode = currentEditMode

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
    this.#currentEditMode.hidePallet()
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
    if (this.#currentEditMode.isTypeValuesPalletShown) {
      this.#currentEditMode.selectLeftAttributeTab()
    } else {
      this.#horizontal.left(shiftKey)
    }
  }

  selectRight(shiftKey) {
    if (this.#currentEditMode.isTypeValuesPalletShown) {
      this.#currentEditMode.selectRightAttributeTab()
    } else {
      this.#horizontal.right(shiftKey)
    }
  }

  selectUp() {
    if (this.#currentEditMode.isEditDenotation) {
      this.#vertical.up()
    }
  }

  selectDown() {
    if (this.#currentEditMode.isEditDenotation) {
      this.#vertical.down()
    }
  }

  applyTextSelectionWithTouchDevice() {
    if (this.#isActive) {
      this.#currentEditMode.applyTextSelectionWithTouchDevice()
    }
  }
}
