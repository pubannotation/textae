import getTargetSpanWhenFocusNodeSameWithAnchorNode from './getTargetSpanWhenFocusNodeSameWithAnchorNode'
import shrinkSpanToSelectionAndSelectNextIfRemoved from './shrinkSpanToSelectionAndSelectNextIfRemoved'

export default function(editor, annotationData, selectionModel, command, spanAdjuster, selection, spanConfig) {
  const spanId = getTargetSpanWhenFocusNodeSameWithAnchorNode(annotationData, selectionModel, selection)

  if (spanId) {
    selectionModel.clear()
    shrinkSpanToSelectionAndSelectNextIfRemoved(editor, annotationData, command, spanAdjuster, spanId, selection, spanConfig, selectionModel)
  }
}
