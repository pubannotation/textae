import {
  EventEmitter
}
from 'events'
import IdContainer from './IdContainer'

export default function(kinds) {
  let emitter = new EventEmitter(),
    containerList = kinds.map(IdContainer),
    hash = containerList
    .reduce((a, b) => {
      a[b.name] = b
      return a
    }, {})

  relayEventsOfEachContainer(emitter, containerList)

  return Object.assign(emitter, hash, {
    clear: () => clearAll(containerList),
    some: () => someAll(containerList)
  })
}

function clearAll(containerList) {
  containerList.forEach((container) => container.clear())
}

function someAll(containerList) {
  return containerList
    .map((container) => container.some())
    .reduce((a, b) => a || b)
}

function relayEventsOfEachContainer(emitter, containerList) {
  containerList.forEach((container) => {
    container
      .on(container.name + '.change', function() {
        emitter.emit(container.name + '.change')
      })
      .on(container.name + '.add', function(id) {
        emitter.emit(container.name + '.select', id)
      })
      .on(container.name + '.remove', function(id) {
        emitter.emit(container.name + '.deselect', id)
      })
  })
}
