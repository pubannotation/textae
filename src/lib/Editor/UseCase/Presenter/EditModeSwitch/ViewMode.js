import EditMode from './EditMode'

export default class ViewMode extends EditMode {
  #startOffset
  #endOffset

  constructor(eventEmitter) {
    super()
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
      const textBoxes = document.querySelectorAll('.textae-editor__text-box')

      textBoxes.forEach((textBox) => {
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
      })
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
