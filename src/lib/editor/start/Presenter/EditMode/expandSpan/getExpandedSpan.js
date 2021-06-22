export default function (
  annotationData,
  spanAdjuster,
  spanId,
  selectionWrapper,
  spanConfig
) {
  const span = annotationData.span.get(spanId)
  const { anchor, focus } = selectionWrapper.getPositionsOnAnnotation()

  if (anchor < focus) {
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
  } else {
    // expand to the left
    return {
      begin: spanAdjuster.backFromBegin(
        annotationData.sourceDoc,
        focus,
        spanConfig
      ),
      end: span.end
    }
  }
}
