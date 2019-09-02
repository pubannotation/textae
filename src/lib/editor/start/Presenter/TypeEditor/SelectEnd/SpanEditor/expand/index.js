import getExpandTargetSpan from './getExpandTargetSpan'
import expandSpanToSelection from './expandSpanToSelection'

export default function(
  annotationData,
  selectionModel,
  commander,
  spanAdjuster,
  selection,
  spanConfig
) {
  const spanId = getExpandTargetSpan(annotationData, selectionModel, selection)

  if (spanId) {
    selectionModel.clear()
    expandSpanToSelection(
      annotationData,
      commander,
      spanAdjuster,
      spanId,
      selection,
      spanConfig
    )
  }
}
