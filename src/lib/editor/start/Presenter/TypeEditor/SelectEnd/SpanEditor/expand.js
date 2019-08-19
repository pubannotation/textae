import { isBoundaryCrossingWithOtherSpans } from '../../../../../Model/AnnotationData/parseAnnotation/validateAnnotation'
import deferAlert from '../deferAlert'
import * as selectPosition from '../selectPosition'
import * as isInSelected from './isInSelected'

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

function getExpandTargetSpan(annotationData, selectionModel, selection) {
  // If a span is selected, it is able to begin drag a span in the span and expand the span.
  // The focus node should be at one level above the selected node.
  if (
    isInSelected.isAnchorInSelectedSpan(
      annotationData,
      selectionModel,
      selection
    )
  ) {
    // cf.
    // 1. one side of a inner span is same with one side of the outside span.
    // 2. Select an outside span.
    // 3. Begin Drug from an inner span to out of an outside span.
    // Expand the selected span.
    return selectionModel.span.single()
  } else if (isAnchorOneDownUnderForcus(selection)) {
    // To expand the span , belows are needed:
    // 1. The anchorNode is in the span.
    // 2. The foucusNode is out of the span and in the parent of the span.
    return selection.anchorNode.parentNode.id
  }

  return null
}

function expandSpanToSelection(
  annotationData,
  command,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  const newSpan = getNewSpan(
    annotationData,
    spanAdjuster,
    spanId,
    selection,
    spanConfig
  )

  // The span cross exists spans.
  if (isBoundaryCrossingWithOtherSpans(annotationData.span.all, newSpan)) {
    deferAlert('A span cannot be expanded to make a boundary crossing.')
    return
  }

  command.invoke([command.factory.spanMoveCommand(spanId, newSpan)])
}

function isAnchorOneDownUnderForcus(selection) {
  return (
    selection.anchorNode.parentNode.parentNode ===
    selection.focusNode.parentNode
  )
}

function getNewSpan(
  annotationData,
  spanAdjuster,
  spanId,
  selection,
  spanConfig
) {
  const anchorPosition = selectPosition.getAnchorPosition(
    annotationData,
    selection
  )
  const focusPosition = selectPosition.getFocusPosition(
    annotationData,
    selection
  )

  return getNewExpandSpan(
    annotationData,
    spanAdjuster,
    spanId,
    anchorPosition,
    focusPosition,
    spanConfig
  )
}

function getNewExpandSpan(
  annotationData,
  spanAdjuster,
  spanId,
  anchorPosition,
  focusPosition,
  spanConfig
) {
  const span = annotationData.span.get(spanId)

  if (anchorPosition > focusPosition) {
    // expand to the left
    return {
      begin: spanAdjuster.backFromBegin(
        annotationData.sourceDoc,
        focusPosition,
        spanConfig
      ),
      end: span.end
    }
  } else {
    // expand to the right
    return {
      begin: span.begin,
      end:
        spanAdjuster.forwardFromEnd(
          annotationData.sourceDoc,
          focusPosition - 1,
          spanConfig
        ) + 1
    }
  }
}
