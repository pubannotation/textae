export default function(annotationData, spanRenderer) {
  // For tuning
  // var startTime = new Date();
  annotationData.span.topLevel().forEach((span) => {
    spanRenderer.render(span)
  })
  // For tuning
  // var endTime = new Date();
  // console.log('render all span : ', endTime.getTime() - startTime.getTime() + 'ms');
}
