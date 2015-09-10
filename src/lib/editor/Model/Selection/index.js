import {
  EventEmitter
}
from 'events'
import IdContainer from './IdContainer'

export default function(kinds) {
  let emitter = new EventEmitter(),
    map = new Map(kinds.map(kindName => [kindName, new IdContainer(emitter, kindName)])),
    hash = {}

  map.forEach((container, name) => {
    hash[name] = container
  })

  return Object.assign(emitter, hash, {
    clear: () => map.forEach((c) => c.clear()),
    some: () => someAll(map)
  })
}

function someAll(map) {
  let ret = false
  map.forEach(c => ret = ret || c.some())
  return ret
}
