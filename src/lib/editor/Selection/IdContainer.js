export default function(emitter, kindName) {
  let selected = new Set()

  return {
    add: (id) => add(selected, emitter, kindName, id),
    all: () => Array.from(selected.values()),
    has: (id) => selected.has(id),
    some: () => selected.size > 0,
    single: () => single(selected),
    toggle: (id) => toggle(selected, emitter, kindName, id),
    remove: (id) => remove(selected, emitter, kindName, id),
    clear: () => clear(selected, emitter, kindName)
  }
}

function triggerChange(emitter, kindName) {
  emitter.emit(kindName + '.change')
}

function add(selected, emitter, kindName, id) {
  if (id.forEach) {
    id.forEach(id => {
      selected.add(id)
      emitter.emit(kindName + '.select', id)
      triggerChange(emitter, kindName)
    })
  } else {
    selected.add(id)
    emitter.emit(kindName + '.select', id)
    triggerChange(emitter, kindName)
  }
}

function single(selected) {
  return selected.size === 1 ? selected.values().next().value : null
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
  emitter.emit(kindName + '.deselect', id)
  triggerChange(emitter, kindName)
}

function clear(selected, emitter, kindName) {
  if (selected.size === 0) return

  selected.forEach((id) => remove(selected, emitter, kindName, id))
  triggerChange(emitter, kindName)
}
