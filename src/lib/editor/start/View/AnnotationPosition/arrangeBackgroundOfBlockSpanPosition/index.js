import updateBackgroundOfBlockSpanPosition from './updateBackgroundOfBlockSpanPosition'

export default function (annotationData, textBox) {
  for (const span of annotationData.span.allBlockSpans) {
    updateBackgroundOfBlockSpanPosition(span, textBox)
  }
}
