import getExpandTargetSpan from './getExpandTargetSpan'
import expandSpanToSelection from './expandSpanToSelection'

export default function(
  annotationData,
  selectionModel,
  command,
  spanAdjuster,
  selection,
  spanConfig
) {
  const spanId = getExpandTargetSpan(annotationData, selectionModel, selection)

  if (spanId) {
    selectionModel.clear()
    expandSpanToSelection(
      annotationData,
      command,
      spanAdjuster,
      spanId,
      selection,
      spanConfig
    )
  }
}
