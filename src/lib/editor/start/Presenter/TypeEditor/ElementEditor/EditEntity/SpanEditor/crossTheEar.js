import shrinkSpanToSelectionAndSelectNextIfRemoved from './shrinkSpanToSelectionAndSelectNextIfRemoved'

export default function(
  editor,
  annotationData,
  selectionModel,
  commander,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig
) {
  if (spanId) {
    selectionModel.clear()
    shrinkSpanToSelectionAndSelectNextIfRemoved(
      editor,
      annotationData,
      commander,
      spanAdjuster,
      spanId,
      selectionWrapper,
      spanConfig,
      selectionModel
    )
  }
}
