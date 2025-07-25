import EditModeBase from '../EditModeBase'
import updateSelection from './updateSelection'

export default class ViewMode extends EditModeBase {
  #editorHTMLElement
  #eventEmitter
  #annotationModel
  #selectedTextStartOffset
  #selectedTextEndOffset
  #spanConfig
  #menuState

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
        const { begin, end } = this.#annotationModel.getTextSelection(
          this.#spanConfig,
          this.#menuState.textSelectionAdjuster
        )

        updateSelection(selection, textBox, begin, end)

        this.#selectedTextStartOffset = begin
        this.#selectedTextEndOffset = end
      }
    } else {
      this.#selectedTextStartOffset = undefined
      this.#selectedTextEndOffset = undefined
    }

    this.#eventEmitter.emit('textae-event.editor.selected-text.change')
  }
}
