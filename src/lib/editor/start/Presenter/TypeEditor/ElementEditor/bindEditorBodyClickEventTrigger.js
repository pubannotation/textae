import delegate from 'delegate'

// Trigger body click event
// The blank area on the editor is textae-editor__body__text-box.
export default function(editor) {
  return delegate(editor[0], '.textae-editor__body__text-box', 'click', (e) => {
    // The delegate also fires events for child elements of the selector.
    // Ignores events that occur in child elements.
    // Otherwise, you cannot select child elements.
    if (e.target.classList.contains('textae-editor__body__text-box')) {
      editor.eventEmitter.emit('textae.editor.body.click')
    }
  })
}
