import delegate from 'delegate'
import spanClicked from './spanClicked'
import bodyClicked from './bodyClicked'
import typeValeusClicked from './typeValuesClicked'
import entityClicked from './entityClicked'

// For support context menu.
// Mouse up event occurs when either left or right button is clicked.
// Change mouse events to monitor from mouseup to click since v5.0.0.
export default function(
  editor,
  selectEnd,
  spanConfig,
  selectSpan,
  selectionModel
) {
  const listeners = []

  // Trigger body click event
  // The blank area on the editor is textae-editor__body__text-box or textae-editor__body__text-box__paragraph-margin.
  listeners.push(
    delegate(editor[0], '.textae-editor__body__text-box', 'click', (e) => {
      // The delegate also fires events for child elements of the selector.
      // Ignores events that occur in child elements.
      // Otherwise, you cannot select child elements.
      if (
        e.target.classList.contains('textae-editor__body__text-box') ||
        e.target.classList.contains(
          'textae-editor__body__text-box__paragraph-margin'
        )
      ) {
        editor.eventEmitter.emit('textae.editor.body.click')
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__body', 'click', (e) =>
      bodyClicked(selectEnd, spanConfig, e)
    )
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__type', 'click', () => editor.focus())
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__type-values', 'click', (e) =>
      typeValeusClicked(selectionModel, e)
    )
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__entity', 'click', (e) =>
      entityClicked(selectionModel, e)
    )
  )

  // To shrink a span listen the mouseup event.
  listeners.push(
    delegate(editor[0], '.textae-editor__span', 'mouseup', (e) =>
      spanClicked(spanConfig, selectEnd, selectSpan, e)
    )
  )

  return listeners
}
