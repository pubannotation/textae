import renderLazyRelationAll from './renderLazyRelationAll'

export default function(emitter, editor, gridLayout, annotationData, arrangePositionAllRelation, typeGap) {
  emitter.emit('render.start', editor)

  gridLayout.arrangePosition(typeGap)
    .then(() => renderLazyRelationAll(annotationData.relation.all()))
    .then(arrangePositionAllRelation)
    .then(() => emitter.emit('render.end', editor))
    .catch((error) => console.error(error, error.stack))
}
