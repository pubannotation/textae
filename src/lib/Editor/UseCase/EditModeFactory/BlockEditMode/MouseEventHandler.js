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

  /**
   *
   * @param {import('./SpanEditor').default} spanEditor
   */
  constructor(
    editorHTMLElement,
    annotationModel,
    selectionModel,
    spanEditor,
    pallet
  ) {
    this.#editorHTMLElement = editorHTMLElement
    this.#annotationModel = annotationModel
    this.#selectionModel = selectionModel
    this.#spanEditor = spanEditor
    this.#pallet = pallet
  }

  bind() {
    const listeners = []

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__text-box',
        'click',
        (e) => {
          if (e.target.classList.contains('textae-editor__text-box')) {
            this.#textBoxClicked()
          }
        }
      )
    )

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

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__block',
        'mouseup',
        (e) => {
          if (e.target.classList.contains('textae-editor__block')) {
            this.#blockSpanClicked()
          }
        }
      )
    )

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__block-hit-area',
        'mouseup',
        (e) => {
          if (e.target.classList.contains('textae-editor__block-hit-area')) {
            this.#blockHitAreaClicked(e)
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

    listeners.push(
      delegate(
        this.#editorHTMLElement,
        '.textae-editor__span',
        'mouseup',
        (e) => {
          if (e.target.classList.contains('textae-editor__span')) {
            this.#denotationSpanClicked(e)
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
    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this.#pallet.hide()
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

  #blockSpanClicked() {
    const selection = window.getSelection()

    if (selection.type === 'Caret') {
      this.#pallet.hide()
      clearTextSelection()
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

  // Mouse events to the block span are handled by the hit area instead,
  // to show the block span shifted up half a line.
  #blockHitAreaClicked(e) {
    // When you click on the text, the browser will automatically select the word.
    // Therefore, the editor shrinks spans instead of selecting spans.
    // Deselect the text.
    if (e.button === 2) {
      clearTextSelection()
    }

    const selection = window.getSelection()

    // When you create a block span and
    // click on another block span while holding down the Shift key,
    // the Selection type will be 'None'.
    if (selection.type === 'Caret' || selection.type === 'None') {
      const spanId = e.target.dataset.id

      this.#selectSpanAndEntity(e, spanId)
    }
  }

  #styleSpanClicked(e) {
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
      e.stopPropagation()
    }
  }

  #denotationSpanClicked(e) {
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
      e.stopPropagation()
    }
  }

  #signboardClicked() {
    this.#editorHTMLElement.focus()
  }

  #typeValuesClicked(event, entityID) {
    const entity = this.#annotationModel.entityInstanceContainer.get(entityID)

    if (entity.isBlock) {
      if (event.ctrlKey || event.metaKey) {
        this.#selectionModel.entity.toggle(entityID)
      } else {
        this.#selectionModel.selectEntity(entityID)
      }

      // Select span of the selected entity.
      const spans = this.#selectionModel.entity.all
        .map((entity) => entity.span)
        .map((span) => span.id)
      this.#selectionModel.add('span', spans)
    }
  }

  #selectSpanAndEntity(event, spanID) {
    const selectedSpanID = this.#selectionModel.span.singleId
    const rangeOfSpans =
      event.shiftKey && selectedSpanID
        ? this.#annotationModel.spanInstanceContainer.rangeBlockSpan(
            selectedSpanID,
            spanID
          )
        : []

    selectSpan(this.#selectionModel, rangeOfSpans, event, spanID)

    // Select entities of the selected span.
    // Block is a first entity of the span.
    const entities = this.#selectionModel.span.all
      .map((span) => span.entities.at(0))
      .map((entity) => entity.id)

    this.#selectionModel.add('entity', entities)
  }
}
