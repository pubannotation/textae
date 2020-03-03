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
    } else if (
      data.selection.focusNode.parentElement.closest(
        `#${data.selection.anchorNode.parentElement.parentElement.id}`
      )
    ) {
      // When extending the span to the right,
      // if the right edge after stretching is the same as the right edge of the second span,
      // the anchorNode will be the textNode of the first span and the focusNode will be the textNode of the second span.
      // If the Span of the focusNode belongs to the parent of the Span of the anchorNode, the first Span is extensible.
      // The same applies when extending to the left.
      spanEditor.expand(data)
    }
  }

  clearTextSelection()
}
