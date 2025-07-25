import EditModeBase from './EditModeBase'

export default class ViewMode extends EditModeBase {
  #editorHTMLElement
  #eventEmitter
  #annotationModel
  #selectedTextStartOffset
  #selectedTextEndOffset

  constructor(editorHTMLElement, eventEmitter, annotationModel) {
    super()

    this.#editorHTMLElement = editorHTMLElement
    this.#eventEmitter = eventEmitter
    this.#annotationModel = annotationModel
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

    this.#eventEmitter.emit('textae-event.editor.selected-text.change')
  }
}
