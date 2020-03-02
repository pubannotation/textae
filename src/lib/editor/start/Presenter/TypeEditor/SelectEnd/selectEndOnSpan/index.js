import getAnchorPosition from '../getAnchorPosition'
import clearTextSelection from '../../clearTextSelection'
import validateOnSpan from './validateOnSpan'

export default function(spanEditor, annotationData, data) {
  const isValid = validateOnSpan(
    annotationData,
    data.spanConfig,
    data.selection
  )
  if (isValid) {
    if (data.selection.anchorNode === data.selection.focusNode) {
      const ap = getAnchorPosition(annotationData, data.selection)
      const span = annotationData.span.get(
        data.selection.anchorNode.parentElement.id
      )
      if (ap === span.begin || ap === span.end) {
        spanEditor.shrinkPullByTheEar(
          data,
          data.selection.anchorNode.parentElement.id
        )
      } else {
        spanEditor.create(data)
      }
    } else if (
      data.selection.focusNode.parentElement.closest(
        `#${data.selection.anchorNode.parentElement.id}`
      )
    ) {
      spanEditor.shrinkCrossTheEar(data)
    } else if (
      data.selection.anchorNode.parentElement.closest(
        `#${data.selection.focusNode.parentElement.id}`
      )
    ) {
      spanEditor.expand(data)
    }
  }
  clearTextSelection()
}
