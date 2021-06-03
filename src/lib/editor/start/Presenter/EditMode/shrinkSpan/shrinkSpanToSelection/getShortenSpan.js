import PositionsOnAnnotation from '../../PositionsOnAnnotation'

export default function (
  annotationData,
  spanAdjuster,
  selectionWrapper,
  spanConfig,
  spanId
) {
  const { anchor, focus } = new PositionsOnAnnotation(
    annotationData.span,
    selectionWrapper
  )

  const span = annotationData.span.get(spanId)

  if (anchor < focus) {
    // shorten the left boundary
    if (span.end === focus)
      return {
        begin: span.end,
        end: span.end
      }
    return {
      begin: spanAdjuster.forwardFromBegin(
        annotationData.sourceDoc,
        focus,
        spanConfig
      ),
      end: span.end
    }
  } else {
    // shorten the right boundary
    if (span.begin === focus)
      return {
        begin: span.begin,
        end: span.begin
      }
    return {
      begin: span.begin,
      end:
        spanAdjuster.backFromEnd(
          annotationData.sourceDoc,
          focus - 1,
          spanConfig
        ) + 1
    }
  }
}
