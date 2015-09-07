import {
  EventEmitter
}
from 'events'

export default function(kindName) {
  let emitter = new EventEmitter(),
    selected = new Set(),
    mixin = {
      name: kindName,
      add: (id) => add(selected, emitter, kindName, id),
      all: () => toArray(selected),
      has: (id) => selected.has(id),
      some: () => some(selected),
      single: () => single(selected),
      toggle: (id) => toggle(selected, emitter, kindName, id),
      remove: (id) => remove(selected, emitter, kindName, id),
      clear: () => clear(selected, emitter, kindName)
    }

  return Object.assign(emitter, mixin)
}

function triggerChange(emitter, kindName) {
  emitter.emit(kindName + '.change')
}

function add(selected, emitter, kindName, id) {
  selected.add(id)
  emitter.emit(kindName + '.add', id)
  triggerChange(emitter, kindName)
}

function toArray(selected) {
  return Array.from(selected.values())
}

function some(selected) {
  return selected.size > 0
}

function single(selected) {
  let array = toArray(selected)
  return array.length === 1 ? array[0] : null
}

function toggle(selected, emitter, kindName, id) {
  if (selected.has(id)) {
    remove(selected, emitter, kindName, id)
  } else {
    add(selected, emitter, kindName, id)
  }
}

function remove(selected, emitter, kindName, id) {
  selected.delete(id)
  emitter.emit(kindName + '.remove', id)
  triggerChange(emitter, kindName)
}

function clear(selected, emitter, kindName) {
  if (selected.size === 0) return

  toArray(selected).forEach((id) => remove(selected, emitter, kindName, id))
  triggerChange(emitter, kindName)
}
