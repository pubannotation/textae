export default function (annotationData, spanRenderer) {
  for (const span of annotationData.span.topLevel) {
    spanRenderer.render(span)
  }
}
