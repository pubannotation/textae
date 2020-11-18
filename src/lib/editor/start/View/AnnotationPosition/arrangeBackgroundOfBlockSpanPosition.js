export default function (annotationData, textBox) {
  for (const span of annotationData.span.allBlockSpans) {
    span.updateBackgroundOfBlockSpanPosition(textBox)
  }
}
