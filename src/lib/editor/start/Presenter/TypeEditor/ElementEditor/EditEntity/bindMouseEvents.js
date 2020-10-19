import delegate from 'delegate'
import bindEditorBodyClickEventTrigger from '../bindEditorBodyClickEventTrigger'

// For support context menu.
// Mouse up event occurs when either left or right button is clicked.
// Change mouse events to monitor from mouseup to click since v5.0.0.
export default function(editor, mouseEventHandler) {
  const listeners = []

  // In Friefox, the text box click event fires when you shrink and erase a span.
  // To do this, the span mouse-up event selects the span to the right of the erased span,
  // and then the text box click event deselects it.
  // To prevent this, we set a flag to indicate that it is immediately after the span's mouse-up event.
  let afterSpanMouseUpEventFlag = false

  listeners.push(
    delegate(editor[0], '.textae-editor__body__text-box', 'click', (e) => {
      if (
        e.target.classList.contains('textae-editor__body__text-box') &&
        !afterSpanMouseUpEventFlag
      ) {
        mouseEventHandler.textBoxClicked(e)
      }
    })
  )

  // When extending span, the behavior depends on whether span is selected or not;
  // you must not deselect span by firing the 'textae.editor.body.click' event before editing it.
  listeners.push(bindEditorBodyClickEventTrigger(editor))

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

  listeners.push(
    delegate(editor[0], '.textae-editor__entity__endpoint', 'click', (e) =>
      mouseEventHandler.endpointClicked(e)
    )
  )

  // To shrink a span listen the mouseup event.
  listeners.push(
    delegate(editor[0], '.textae-editor__span', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__span')) {
        mouseEventHandler.spanClicked(e)
        afterSpanMouseUpEventFlag = true

        // In Chrome, the text box click event does not fire when you shrink the span and erase it.
        // Instead of beating the flag on the text box click event,
        // it uses a timer to beat the flag instantly, faster than any user action.
        setTimeout(() => (afterSpanMouseUpEventFlag = false), 0)
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
