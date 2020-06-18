import delegate from 'delegate'
import bindEditorBodyClickEventTrigger from '../bindEditorBodyClickEventTrigger'

// For support context menu.
// Mouse up event occurs when either left or right button is clicked.
// Change mouse events to monitor from mouseup to click since v5.0.0.
export default function(editor) {
  const listeners = []

  // Show Alert when trying to create span across paragraphs.
  listeners.push(
    delegate(editor[0], '.textae-editor__body__text-box', 'mouseup', (e) =>
      editor.eventEmitter.emit('textae.editor.editEntity.textBox.mouseup', e)
    )
  )

  // When mouseupping on blank area between lines.
  // You may hover over the text and select the text.
  // No 'textae.editor.body.click' event will be fired when text is selected,
  // so that newly created spans will not be deselected.
  // Monitor the events of the editor's child elements, not the editor.
  // Stop the propagation of events using the stopPropagation function.
  for (const m of editor[0].querySelectorAll(
    '.textae-editor__body__text-box'
  )) {
    listeners.push(
      delegate(m, '.textae-editor__body__text-box', 'click', (e) =>
        editor.eventEmitter.emit('textae.editor.editEntity.textBox.click', e)
      )
    )
  }

  // When extending span, the behavior depends on whether span is selected or not;
  // you must not deselect span by firing the 'textae.editor.body.click' event before editing it.
  listeners.push(bindEditorBodyClickEventTrigger(editor))

  listeners.push(
    delegate(editor[0], '.textae-editor__type', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editEntity.type.click', e)
    )
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__type-values', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editEntity.typeValues.click', e)
    )
  )

  listeners.push(
    delegate(editor[0], '.textae-editor__entity', 'click', (e) =>
      editor.eventEmitter.emit('textae.editor.editEntity.entity.click', e)
    )
  )

  // To shrink a span listen the mouseup event.
  listeners.push(
    delegate(editor[0], '.textae-editor__span', 'mouseup', (e) =>
      editor.eventEmitter.emit('textae.editor.editEntity.span.mouseup', e)
    )
  )

  return listeners
}
