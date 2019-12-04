import add from './add'
import single from './single'
import toggle from './toggle'
import remove from './remove'
import clear from './clear'

export default function(emitter, kindName) {
  const selected = new Set()

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
