import delegate from 'delegate'
import getEntityHTMLelementFromChild from '../../../getEntityHTMLelementFromChild'

// Manupulate only entities and relations on the Edit Relation mode.
// For support context menu.
// Mouse up event occurs when either left or right button is clicked.
// Change mouse events to monitor from mouseup to click since v5.0.0.
export default function (editorHTMLElement, mouseEventHandler) {
  const listeners = []

  // In relation mode does not manipulate the child elements in the text box.
  listeners.push(
    delegate(editorHTMLElement, '.textae-editor__text-box', 'click', () =>
      mouseEventHandler.bodyClicked()
    )
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
    // When a relation is selected, the HTML element of the relation is recreated,
    // so the click event is not fired on the parent element.
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

  return listeners
}
