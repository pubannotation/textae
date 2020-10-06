import delegate from 'delegate'
import bindEditorBodyClickEventTrigger from '../bindEditorBodyClickEventTrigger'

// For support context menu.
// Mouse up event occurs when either left or right button is clicked.
// Change mouse events to monitor from mouseup to click since v5.0.0.
export default function(editor) {
  const listeners = []

  // When mouseupping on blank area between lines.
  // You may hover over the text and select the text.
  // No 'textae.editor.body.click' event will be fired when text is selected,
  // so that newly created spans will not be deselected.
  // Monitor the events of the editor's child elements, not the editor.
  // Stop the propagation of events using the stopPropagation function.
  const m = editor[0].querySelector('.textae-editor__body__text-box')
  listeners.push(
    delegate(m, '.textae-editor__body__text-box', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editEntity.textBox.click', e)
    )
  )

  // When extending span, the behavior depends on whether span is selected or not;
  // you must not deselect span by firing the 'textae.editor.body.click' event before editing it.
  listeners.push(bindEditorBodyClickEventTrigger(editor))

  listeners.push(
    delegate(editor[0], '.textae-editor__entity', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editEntity.entity.click', e)
    )
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__entity__type-values', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editEntity.typeValues.click', e)
    )
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__entity__endpoint', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editEntity.endpoint.click', e)
    )
  )

  // To shrink a span listen the mouseup event.
  listeners.push(
    delegate(editor[0], '.textae-editor__span', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__span')) {
        editor.eventEmitter.emit('textae.editor.editEntity.span.mouseup', e)
      }
    })
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__style', 'mouseup', (e) => {
      if (e.target.classList.contains('textae-editor__style')) {
        editor.eventEmitter.emit('textae.editor.editEntity.style.mouseup', e)
      }
    })
  )

  return listeners
}
