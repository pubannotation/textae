import clearTextSelection from '../../../clearTextSelection'

export default function(onSelectEndOnSpan, selectSpan, event) {
  // When you click on the text, the browser will automatically select the word.
  // Therefore, the editor shrinks spans instead of selecting spans.
  // Deselect the text.
  if (event.button === 2) {
    clearTextSelection()
  }

  const selection = window.getSelection()

  // No select
  if (selection.type === 'Caret') {
    selectSpan(event)
    return false
  } else {
    onSelectEndOnSpan()
    // Cancel selection of a text.
    // And do non propagate the parent span.
    event.stopPropagation()
  }

  return null
}
