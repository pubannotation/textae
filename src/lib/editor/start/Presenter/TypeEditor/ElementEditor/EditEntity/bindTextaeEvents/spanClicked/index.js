import clearTextSelection from '../../../../clearTextSelection'
import selectSpan from './selectSpan'

export default function(
  event,
  annotationData,
  selectionModel,
  onSelectEndOnSpan
) {
  // When you click on the text, the browser will automatically select the word.
  // Therefore, the editor shrinks spans instead of selecting spans.
  // Deselect the text.
  if (event.button === 2) {
    clearTextSelection()
  }

  const selection = window.getSelection()

  // No select
  if (selection.type === 'Caret') {
    selectSpan(annotationData, selectionModel, event)
  } else {
    onSelectEndOnSpan()
    // Cancel selection of a text.
    // And do non propagate the parent span.
    event.stopPropagation()
  }
}
