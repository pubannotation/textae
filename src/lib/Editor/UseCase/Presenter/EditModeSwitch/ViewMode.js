import EditMode from './EditMode'
import debounce300 from '../../../../debounce300'

export default class ViewMode extends EditMode {
  #editorHTMLElement
  #annotationModel
  #startOffset
  #endOffset

  constructor(editorHTMLElement, eventEmitter, annotationModel) {
    super()

    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel

    const emitSelectedTextChange = debounce300(() => {
      this.#updateSelectedTextOffsets()

      eventEmitter.emit('textae-event.editor.selected-text.change')
    })

    document.addEventListener('selectionchange', emitSelectedTextChange)
  }

  get selectedText() {
    if (this.#startOffset === undefined || this.#endOffset === undefined) {
      return {
        status: 'unselected'
      }
    }

    if (
      this.#annotationModel.isBoundaryCrossingWithOtherSpans(
        this.#startOffset,
        this.#endOffset
      )
    ) {
      return {
        status: 'cross boundary detected'
      }
    }

    return {
      begin: this.#startOffset,
      end: this.#endOffset,
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
        this.#startOffset = this.#annotationModel.textSelection.begin
        this.#endOffset = this.#annotationModel.textSelection.end
      }
    } else {
      this.#startOffset = undefined
      this.#endOffset = undefined
    }
  }
}
