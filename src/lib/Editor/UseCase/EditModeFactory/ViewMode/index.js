import removeAllMarks from '../../removeAllMarks'
import EditModeBase from '../EditModeBase'
import markSelection from './markSelection'

export default class ViewMode extends EditModeBase {
  #editorHTMLElement
  #eventEmitter
  #annotationModel
  #selectedTextStartOffset
  #selectedTextEndOffset
  #spanConfig
  #menuState
  #recursiveCallGuradFlag = false

  constructor(
    editorHTMLElement,
    eventEmitter,
    annotationModel,
    spanConfig,
    menuState
  ) {
    super()

    this.#editorHTMLElement = editorHTMLElement
    this.#eventEmitter = eventEmitter
    this.#annotationModel = annotationModel
    this.#spanConfig = spanConfig
    this.#menuState = menuState
  }

  get selectedText() {
    if (
      this.#selectedTextStartOffset === undefined ||
      this.#selectedTextEndOffset === undefined
    ) {
      return {
        status: 'unselected'
      }
    }

    if (
      this.#annotationModel.isBoundaryCrossingWithOtherSpans(
        this.#selectedTextStartOffset,
        this.#selectedTextEndOffset
      )
    ) {
      return {
        status: 'cross boundary detected'
      }
    }

    return {
      begin: this.#selectedTextStartOffset,
      end: this.#selectedTextEndOffset,
      status: 'selected'
    }
  }

  updateSelectedTextOffsets() {
    if (this.#recursiveCallGuradFlag) {
      return
    }

    const selection = document.getSelection()

    if (this.hasEmptySelection(selection)) {
      return
    }

    const range = selection.getRangeAt(0)
    const textBox = this.#editorHTMLElement.querySelector(
      '.textae-editor__text-box'
    )

    if (!this.isSelectionInTextBox(range, textBox)) {
      return
    }

    this.#recursiveCallGuradFlag = true

    // Remove existing <mark> elements
    removeAllMarks(textBox)

    const { begin, end } = this.#annotationModel.getTextSelection(
      this.#spanConfig,
      this.#menuState.textSelectionAdjuster
    )

    markSelection(textBox, begin, end)

    this.#selectedTextStartOffset = begin
    this.#selectedTextEndOffset = end
    this.#eventEmitter.emit('textae-event.editor.selected-text.change')

    // Observing duration is 300ms, but set 600ms for safety.
    setTimeout(() => (this.#recursiveCallGuradFlag = false), 600)
  }

  isSelectionInTextBox(range, textBox) {
    // Contains returns true if the node is itself.
    return (
      range.startContaine !== textBox &&
      range.endContainer !== textBox &&
      textBox.contains(range.startContainer) &&
      textBox.contains(range.endContainer)
    )
  }

  hasEmptySelection(selection) {
    return (
      !selection ||
      selection.rangeCount === 0 ||
      selection.toString().replace(/\s+/g, '').length === 0
    )
  }
}
