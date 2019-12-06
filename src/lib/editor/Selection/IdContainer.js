import add from './add'
import single from './single'
import toggle from './toggle'
import remove from './remove'
import clear from './clear'

export default class {
  constructor(emitter, kindName) {
    this._emitter = emitter
    this._kindName = kindName
    this._selected = new Set()
  }

  add(id) {
    add(this._selected, this._emitter, this._kindName, id)
  }

  all() {
    return Array.from(this._selected.values())
  }

  has(id) {
    return this._selected.has(id)
  }

  some() {
    return this._selected.size > 0
  }

  single() {
    return single(this._selected)
  }

  toggle(id) {
    toggle(this._selected, this._emitter, this._kindName, id)
  }

  remove(id) {
    remove(this._selected, this._emitter, this._kindName, id)
  }

  clear() {
    clear(this._selected, this._emitter, this._kindName)
  }
}
