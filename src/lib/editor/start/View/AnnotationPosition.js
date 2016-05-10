import GridLayout from './GridLayout'
import {
  EventEmitter as EventEmitter
}
from 'events'

export default function(editor, annotationData, typeContainer, arrangePositionAllRelation) {
  const emitter = new EventEmitter(),
    gridLayout = new GridLayout(editor, annotationData, typeContainer),
    update = (typeGapValue) => {
      emitter.emit('render.start', editor)

      return gridLayout.arrangePosition(typeGapValue)
        .then(() => renderLazyRelationAll(annotationData.relation.all()))
        .then(arrangePositionAllRelation)
        .then(() => emitter.emit('render.end', editor))
        .catch((error) => console.error(error, error.stack))
    }

  return Object.assign(emitter, {
    update
  })
}

function renderLazyRelationAll(relations) {
  // Render relations unless rendered.
  return Promise.all(
    relations
    .filter((connect) => connect.render)
    .map((connect) => connect.render())
  )
}
