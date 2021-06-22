export default function (
  annotationData,
  spanAdjuster,
  spanId,
  anchor,
  focus,
  spanConfig
) {
  const span = annotationData.span.get(spanId)

  if (anchor > focus) {
    // expand to the left
    return {
      begin: spanAdjuster.backFromBegin(
        annotationData.sourceDoc,
        focus,
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
          focus - 1,
          spanConfig
        ) + 1
    }
  }
}
