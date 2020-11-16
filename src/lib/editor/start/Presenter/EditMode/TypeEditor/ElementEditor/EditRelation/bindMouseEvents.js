import delegate from 'delegate'

// Manupulate only entities and relations on the Edit Relation mode.
// For support context menu.
// Mouse up event occurs when either left or right button is clicked.
// Change mouse events to monitor from mouseup to click since v5.0.0.
export default function (editor, mouseEventHandler) {
  const listeners = []

  listeners.push(
    delegate(editor[0], '.textae-editor__body__text-box', 'click', (e) => {
      if (e.target.classList.contains('textae-editor__body__text-box')) {
        mouseEventHandler.textBoxClicked()
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor', 'click', (e) => {
      // The delegate also fires events for child elements of the selector.
      // Ignores events that occur in child elements.
      // Otherwise, you cannot select child elements.
      if (e.target.classList.contains('textae-editor')) {
        mouseEventHandler.bodyClicked()
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__entity', 'click', () =>
      mouseEventHandler.entityClicked()
    )
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__entity__type-values', 'click', (e) =>
      mouseEventHandler.typeValuesClicked(e)
    )
  )

  return listeners
}
