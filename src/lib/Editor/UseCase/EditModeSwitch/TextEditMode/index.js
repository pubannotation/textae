import delegate from 'delegate'
import EditMode from '../EditMode'
import isTextSelectionInTextBox from '../isTextSelectionInTextBox'
import TextEditDialog from './TextEditDialog'

export default class TextEditMode extends EditMode {
  #editorHTMLElement
  #annotationModel
  #spanConfig
  #menuState
  #commander
  #dialog

  constructor(
    editorHTMLElement,
    annotationModel,
    spanConfig,
    menuState,
    commander
  ) {
    super()
    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel
    this.#spanConfig = spanConfig
    this.#menuState = menuState
    this.#commander = commander
    this.#dialog = new TextEditDialog(
      editorHTMLElement,
      (begin, end, originalText, editedText) => {
        if (originalText === editedText) {
          return
        }

        const command = this.#commander.factory.changeTextAndMoveSpanCommand(
          begin,
          end,
          editedText
        )
        this.#commander.invoke(command)
      }
    )
  }

  bindMouseEvents() {
    const listeners = []

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__text-box',
        'click',
        () => this.#handleTexSelection()
      )
    )

    return listeners
  }

  applyTextSelectionWithTouchDevice() {
    this.#menuState.updateButtonsToOperateSpanWithTouchDevice(
      false,
      false,
      false,
      this.#is_editable
    )
  }

  editTextWithTouchDevice() {
    this.#handleTexSelection()
  }

  #handleTexSelection() {
    if (!this.#is_editable) {
      return
    }

    const { begin, end } = this.#annotationModel.getTextSelection(
      this.#spanConfig,
      this.#menuState.textSelectionAdjuster
    )

    if (!this.#annotationModel.validateEditableText(begin, end)) {
      return false
    }

    const targetText = this.#annotationModel.getTextBetween(begin, end)
    this.#dialog.open(begin, end, targetText)
  }

  get #is_editable() {
    if (!isTextSelectionInTextBox(this.#textBox)) {
      return false
    }

    if (!this.#annotationModel.hasCharacters(this.#spanConfig)) {
      return false
    }

    return true
  }

  get #textBox() {
    return this.#editorHTMLElement.querySelector('.textae-editor__text-box')
  }
}
