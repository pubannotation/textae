import delegate from 'delegate'
import getEntityHTMLelementFromChild from '../../../getEntityHTMLelementFromChild'

export default function (editorHTMLElement, mouseEventHandler) {
  const listeners = []

  listeners.push(
    delegate(editorHTMLElement, '.textae-editor__text-box', 'click', (e) => {
      if (e.target.classList.contains('textae-editor__text-box')) {
        mouseEventHandler.textBoxClicked()
      }
    })
  )

  listeners.push(
    delegate(editorHTMLElement, '.textae-editor', 'click', (e) => {
      // The delegate also fires events for child elements of the selector.
      // Ignores events that occur in child elements.
      // Otherwise, you cannot select child elements.
      if (e.target.classList.contains('textae-editor')) {
        mouseEventHandler.bodyClicked()
      }
    })
  )

  listeners.push(
    delegate(editorHTMLElement, '.textae-editor__signboard', 'mousedown', () =>
      mouseEventHandler.signboardClicked()
    )
  )

  listeners.push(
    delegate(
      editorHTMLElement,
      '.textae-editor__signboard__type-values',
      'click',
      (event) => {
        const entityID = getEntityHTMLelementFromChild(event.target).dataset.id
        mouseEventHandler.typeValuesClicked(event, entityID)
      }
    )
  )

  listeners.push(
    delegate(editorHTMLElement, '.textae-editor__block', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__block')) {
        mouseEventHandler.blockSpanClicked()
      }
    })
  )

  listeners.push(
    delegate(
      editorHTMLElement,
      '.textae-editor__block-hit-area',
      'mouseup',
      (e) => {
        if (e.target.classList.contains('textae-editor__block-hit-area')) {
          mouseEventHandler.blockHitAreaClicked(e)
        }
      }
    )
  )

  listeners.push(
    delegate(editorHTMLElement, '.textae-editor__style', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__style')) {
        mouseEventHandler.styleSpanClicked(e)
      }
    })
  )

  listeners.push(
    delegate(editorHTMLElement, '.textae-editor__span', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__span')) {
        mouseEventHandler.denotationSpanClicked(e)
      }
    })
  )

  return listeners
}
