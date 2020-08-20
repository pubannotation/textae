export default function(annotationData, spanRenderer) {
  annotationData.span.topLevel().forEach((span) => {
    spanRenderer.render(span)
  })
}
