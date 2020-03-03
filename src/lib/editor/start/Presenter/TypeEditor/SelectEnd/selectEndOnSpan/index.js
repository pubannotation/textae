import clearTextSelection from '../../clearTextSelection'
import Positions from '../Positions'
import validateOnSpan from './validateOnSpan'

export default function(spanEditor, annotationData, data) {
  const isValid = validateOnSpan(
    annotationData,
    data.spanConfig,
    data.selection
  )
  if (isValid) {
    if (data.selection.anchorNode === data.selection.focusNode) {
      const positions = new Positions(annotationData, data.selection)
      const span = annotationData.span.get(
        data.selection.anchorNode.parentElement.id
      )
      if (positions.anchor === span.begin || positions.anchor === span.end) {
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
