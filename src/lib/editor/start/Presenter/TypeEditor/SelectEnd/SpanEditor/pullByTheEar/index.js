import getTargetSpanWhenFocusNodeSameWithAnchorNode from './getTargetSpanWhenFocusNodeSameWithAnchorNode'
import shrinkSpanToSelectionAndSelectNextIfRemoved from '../shrinkSpanToSelectionAndSelectNextIfRemoved'

export default function(
  editor,
  annotationData,
  selectionModel,
  commander,
  spanAdjuster,
  selection,
  spanConfig
) {
  const spanId = getTargetSpanWhenFocusNodeSameWithAnchorNode(
    annotationData,
    selectionModel,
    selection
  )

  if (spanId) {
    selectionModel.clear()
    shrinkSpanToSelectionAndSelectNextIfRemoved(
      editor,
      annotationData,
      commander,
      spanAdjuster,
      spanId,
      selection,
      spanConfig,
      selectionModel
    )
  }
}
