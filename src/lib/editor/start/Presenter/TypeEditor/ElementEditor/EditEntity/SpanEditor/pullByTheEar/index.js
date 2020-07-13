import getTargetSpanWhenFocusNodeSameWithAnchorNode from './getTargetSpanWhenFocusNodeSameWithAnchorNode'
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
  const spanId = getTargetSpanWhenFocusNodeSameWithAnchorNode(
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
