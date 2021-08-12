import delegate from 'delegate'

// For support context menu.
// Mouse up event occurs when either left or right button is clicked.
// Change mouse events to monitor from mouseup to click since v5.0.0.
export default function (editor, mouseEventHandler) {
  const listeners = []

  // In Friefox, the text box click event fires when you shrink and erase a span.
  // To do this, the span mouse-up event selects the span to the right of the erased span,
  // and then the text box click event deselects it.
  // To prevent this, we set a flag to indicate that it is immediately after the span's mouse-up event.
  let afterSpanMouseUpEventFlag = false

  listeners.push(
    delegate(editor[0], '.textae-editor__text-box', 'click', (e) => {
      if (
        e.target.classList.contains('textae-editor__text-box') &&
        !afterSpanMouseUpEventFlag
      ) {
        mouseEventHandler.textBoxClicked()
      }
    })
  )

  // When extending span, the behavior depends on whether span is selected or not;
  // you must not deselect span before editing it.
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
    delegate(editor[0], '.textae-editor__signboard', 'mousedown', () =>
      mouseEventHandler.signboardClicked()
    )
  )

  listeners.push(
    delegate(
      editor[0],
      '.textae-editor__signboard__type-values',
      'click',
      (e) => mouseEventHandler.typeValuesClicked(e)
    )
  )

  // To shrink a span listen the mouseup event.
  listeners.push(
    delegate(editor[0], '.textae-editor__span', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__span')) {
        mouseEventHandler.denotationSpanClicked(e)
        afterSpanMouseUpEventFlag = true

        // In Chrome, the text box click event does not fire when you shrink the span and erase it.
        // Instead of beating the flag on the text box click event,
        // it uses a timer to beat the flag instantly, faster than any user action.
        setTimeout(() => (afterSpanMouseUpEventFlag = false), 0)
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__block', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__block')) {
        mouseEventHandler.blockSpanClicked(e)
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__style', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__style')) {
        mouseEventHandler.styleSpanClicked(e)
      }
    })
  )

  return listeners
}
