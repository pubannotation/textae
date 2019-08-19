export default function(
  annotationData,
  spanAdjuster,
  spanId,
  anchorPosition,
  focusPosition,
  spanConfig
) {
  const span = annotationData.span.get(spanId)

  if (anchorPosition < focusPosition) {
    // shorten the left boundary
    if (span.end === focusPosition)
      return {
        begin: span.end,
        end: span.end
      }
    return {
      begin: spanAdjuster.forwardFromBegin(
        annotationData.sourceDoc,
        focusPosition,
        spanConfig
      ),
      end: span.end
    }
  } else {
    // shorten the right boundary
    if (span.begin === focusPosition)
      return {
        begin: span.begin,
        end: span.begin
      }
    return {
      begin: span.begin,
      end:
        spanAdjuster.backFromEnd(
          annotationData.sourceDoc,
          focusPosition - 1,
          spanConfig
        ) + 1
    }
  }
}
