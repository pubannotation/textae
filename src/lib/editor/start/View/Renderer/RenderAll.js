import getAnnotationBox from './getAnnotationBox'

export default function(
  editor,
  domPositionCache,
  spanRenderer,
  relationRenderer
) {
  return function(annotationData) {
    // Render annotations
    getAnnotationBox(editor).empty()
    domPositionCache.gridPositionCache.clear()
    renderAllSpan(annotationData, spanRenderer)

    // Render relations
    renderAllRelation(annotationData, relationRenderer)
  }
}

function renderAllSpan(annotationData, spanRenderer) {
  // For tuning
  // var startTime = new Date();

  annotationData.span.topLevel().forEach(function(span) {
    spanRenderer.render(span)
  })

  // For tuning
  // var endTime = new Date();
  // console.log('render all span : ', endTime.getTime() - startTime.getTime() + 'ms');
}

function renderAllRelation(annotationData, relationRenderer) {
  relationRenderer.reset()
  annotationData.relation
    .all()
    .forEach((relatiton) => relationRenderer.render(relatiton))
}
