import getTargetSpanWhenFocusNodeSameWithAnchorNode from './getTargetSpanWhenFocusNodeSameWithAnchorNode'
import shrinkSpanToSelection from './shrinkSpanToSelection'

export default function(editor, model, command, spanAdjuster, selection, spanConfig) {
  const spanId = getTargetSpanWhenFocusNodeSameWithAnchorNode(model, selection)

  if (spanId) {
    shrinkSpanToSelection(editor, model, command, spanAdjuster, spanId, selection, spanConfig)
  }
}
