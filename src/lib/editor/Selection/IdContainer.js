import add from './add'
import single from './single'
import toggle from './toggle'
import remove from './remove'
import clear from './clear'

export default class {
  constructor(emitter, kindName, annotationData) {
    this._emitter = emitter
    this._kindName = kindName
    this._selected = new Set()
    this._annotationData = annotationData
  }

  add(id) {
    add(this._selected, this._emitter, this._kindName, id)
  }

  has(id) {
    return this._selected.has(id)
  }

  get all() {
    return Array.from(this._selected.values()).map((id) =>
      this._annotationData[this._kindName].get(id)
    )
  }

  get some() {
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
