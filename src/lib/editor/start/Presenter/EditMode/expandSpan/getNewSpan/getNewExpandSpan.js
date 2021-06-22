export default function (
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
