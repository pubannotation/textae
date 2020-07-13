import getTargetSpanWhenFocusNodeDifferentFromAnchorNode from './getTargetSpanWhenFocusNodeDifferentFromAnchorNode'
import shrinkSpanToSelectionAndSelectNextIfRemoved from '../shrinkSpanToSelectionAndSelectNextIfRemoved'

export default function(
  editor,
  annotationData,
  selectionModel,
  commander,
  spanAdjuster,
  selectionWrapper,
  spanConfig
) {
  const spanId = getTargetSpanWhenFocusNodeDifferentFromAnchorNode(
    annotationData,
    selectionModel,
    selectionWrapper
  )

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
