import EditMode from './EditMode'

export default class ViewMode extends EditMode {
  #editorHTMLElement
  #startOffset
  #endOffset

  constructor(editorHTMLElement, eventEmitter) {
    super()

    this.#editorHTMLElement = editorHTMLElement

    document.addEventListener('selectionchange', () => {
      this.#updateSelectedTextOffsets()

      eventEmitter.emit('textae-event.editor.selected-text.change')
    })
  }

  get selectedText() {
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

      if (textBox.contains(range.startContainer)) {
        this.#startOffset = this.#getOffsetInContainer(
          textBox,
          range.startContainer,
          range.startOffset
        )
        this.#endOffset = this.#getOffsetInContainer(
          textBox,
          range.endContainer,
          range.endOffset
        )
      }
    }
  }

  #getOffsetInContainer(container, node, offset) {
    let current = node
    let totalOffset = offset

    while (current && current !== container) {
      while (current.previousSibling) {
        current = current.previousSibling
        totalOffset += current.textContent.length
      }
      current = current.parentNode
    }

    return totalOffset
  }
}
