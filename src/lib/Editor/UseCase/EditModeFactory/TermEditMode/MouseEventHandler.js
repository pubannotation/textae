import delegate from 'delegate'
import getEntityHTMLelementFromChild from '../../getEntityHTMLelementFromChild'
import clearTextSelection from '../clearTextSelection'
import isTextSelectionInTextBox from '../isTextSelectionInTextBox'
import selectSpan from '../selectSpan'

export default class MouseEventHandler {
  #editorHTMLElement
  #annotationModel
  #selectionModel
  #spanEditor
  #pallet

  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    pallet,
    spanEditor
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel
    this.#selectionModel = selectionModel
    this.#spanEditor = spanEditor
    this.#pallet = pallet
  }

  bind() {
    const listeners = []

    // In Firefox, the text box click event fires when you shrink and erase a span.
    // To do this, the span mouse-up event selects the span to the right of the erased span,
    // and then the text box click event deselects it.
    // To prevent this, we set a flag to indicate that it is immediately after the span's mouse-up event.
    let afterSpanMouseUpEventFlag = false

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__text-box',
        'click',
        (e) => {
          if (
            e.target.classList.contains('textae-editor__text-box') &&
            !afterSpanMouseUpEventFlag
          ) {
            this.#textBoxClicked()
          }
        }
      )
    )

    // When extending span, the behavior depends on whether span is selected or not;
    // you must not deselect span before editing it.
    listeners.push(
      delegate(this.#editorHTMLElement, '.textae-editor', 'click', (e) => {
        // The delegate also fires events for child elements of the selector.
        // Ignores events that occur in child elements.
        // Otherwise, you cannot select child elements.
        if (e.target.classList.contains('textae-editor')) {
          this.#bodyClicked()
        }
      })
    )

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__signboard',
        'mousedown',
        () => this.#signboardClicked()
      )
    )

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__signboard__type-values',
        'click',
        (event) => {
          const entityID = getEntityHTMLelementFromChild(event.target).dataset
            .id
          this.#typeValuesClicked(event, entityID)
        }
      )
    )

    // To shrink a span listen the mouseup event.
    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__span',
        'mouseup',
        (e) => {
          if (e.target.classList.contains('textae-editor__span')) {
            this.#denotationSpanClicked(e)
            afterSpanMouseUpEventFlag = true

            // In Chrome, the text box click event does not fire when you shrink the span and erase it.
            // Instead of beating the flag on the text box click event,
            // it uses a timer to beat the flag instantly, faster than any user action.
            setTimeout(() => (afterSpanMouseUpEventFlag = false), 0)
          }
        }
      )
    )

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__block',
        'mouseup',
        (e) => {
          if (e.target.classList.contains('textae-editor__block')) {
            this.#blockSpanClicked(e)
          }
        }
      )
    )

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__style',
        'mouseup',
        (e) => {
          if (e.target.classList.contains('textae-editor__style')) {
            this.#styleSpanClicked(e)
          }
        }
      )
    )

    return listeners
  }

  #bodyClicked() {
    this.#pallet.hide()
    this.#selectionModel.removeAll()
  }

  #textBoxClicked() {
    this.#pallet.hide()

    const _selection = window.getSelection()

    if (
      isTextSelectionInTextBox(
        this.#editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this.#spanEditor.editFor()
    } else {
      this.#selectionModel.removeAll()
    }
  }

  #denotationSpanClicked(event) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (event.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    // When you create a denotation span and
    // click on another denotation span while holding down the Shift key,
    // the Selection type will be 'None'.
    if (selection.type === 'Caret' || selection.type === 'None') {
      this.#selectSpan(event, event.target.id)
    }

    if (
      isTextSelectionInTextBox(
        this.#editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this.#spanEditor.editFor()
    }
  }

  #blockSpanClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this.#selectionModel.removeAll()
    }

    if (
      isTextSelectionInTextBox(
        this.#editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this.#spanEditor.editFor()
    }
  }

  #styleSpanClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      const span = e.target.closest('.textae-editor__span')
      if (span) {
        this.#selectSpan(e, span.id)
      } else {
        this.#selectionModel.removeAll()
      }
    }

    if (
      isTextSelectionInTextBox(
        this.#editorHTMLElement.querySelector('.textae-editor__text-box')
      )
    ) {
      this.#spanEditor.editFor()
    }
  }

  #signboardClicked() {
    this.#editorHTMLElement.focus()
  }

  #typeValuesClicked(event, entityID) {
    if (
      this.#annotationModel.entityInstanceContainer.get(entityID).isDenotation
    ) {
      if (event.ctrlKey || event.metaKey) {
        this.#selectionModel.entity.toggle(entityID)
      } else {
        this.#selectionModel.selectEntity(entityID)
      }
    }
  }

  #selectSpan(event, spanID) {
    const selectedSpanID = this.#selectionModel.span.singleId
    const rangeOfSpans =
      event.shiftKey && selectedSpanID
        ? this.#annotationModel.spanInstanceContainer.rangeDenotationSpan(
            selectedSpanID,
            spanID
          )
        : []

    selectSpan(this.#selectionModel, rangeOfSpans, event, spanID)
  }
}
