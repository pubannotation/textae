import getTargetSpanWhenFocusNodeDifferentFromAnchorNode from './getTargetSpanWhenFocusNodeDifferentFromAnchorNode'
import shrinkSpanToSelection from './shrinkSpanToSelection'

export default function(editor, model, command, spanAdjuster, selection, spanConfig) {
  const spanId = getTargetSpanWhenFocusNodeDifferentFromAnchorNode(model, selection)

  if (spanId) {
    shrinkSpanToSelection(editor, model, command, spanAdjuster, spanId, selection, spanConfig)
  }
}
