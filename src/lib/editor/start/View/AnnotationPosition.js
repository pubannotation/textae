import GridLayout from './GridLayout'
import {
  EventEmitter as EventEmitter
}
from 'events'
import $ from 'jquery'

export default function(editor, annotationData, typeContainer, arrangePositionAllRelation) {
  const emitter = new EventEmitter(),
    gridLayout = new GridLayout(editor, annotationData, typeContainer),
    update = (typeGap) => {
      emitter.emit('render.start', editor)

      gridLayout.arrangePosition(typeGap)
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
