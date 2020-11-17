export default function (spanContainer, textBox) {
  for (const span of spanContainer.allBlockSpans) {
    span.updateSidekicksOfBlockSpanPosition(textBox)
  }
}
