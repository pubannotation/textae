import EditMode from './EditMode'
import debounce300 from '../../../../debounce300'

export default class ViewMode extends EditMode {
  #editorHTMLElement
  #annotationModel
  #selectedTextStartOffset
  #selectedTextEndOffset

  constructor(editorHTMLElement, eventEmitter, annotationModel) {
    super()

    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel

    const updateSelectedText = debounce300(() => {
      this.#updateSelectedTextOffsets()

      eventEmitter.emit('textae-event.editor.selected-text.change')
    })

    document.addEventListener('selectionchange', updateSelectedText)
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

  #updateSelectedTextOffsets() {
    const selection = document.getSelection()
    if (selection && selection.rangeCount > 0) {
      const range = selection.getRangeAt(0)
      const textBox = this.#editorHTMLElement.querySelector(
        '.textae-editor__text-box'
      )

      if (
        textBox.contains(range.startContainer) &&
        textBox.contains(range.endContainer)
      ) {
        this.#selectedTextStartOffset =
          this.#annotationModel.textSelection.begin
        this.#selectedTextEndOffset = this.#annotationModel.textSelection.end
      }
    } else {
      this.#selectedTextStartOffset = undefined
      this.#selectedTextEndOffset = undefined
    }
  }
}
