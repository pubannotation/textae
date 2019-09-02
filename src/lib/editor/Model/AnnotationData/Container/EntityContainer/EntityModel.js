export default class {
  constructor(emitter, span, type, id = null) {
    this._span = span
    this._type = type
    this._id = id
    this._emitter = emitter
  }

  get id() {
    return this._id
  }

  set id(val) {
    this._id = val
  }

  get span() {
    return this._span
  }

  set span(val) {
    this._span = val
  }

  get type() {
    return this._type
  }

  set type(val) {
    this._type = val
  }

  get attributes() {
    return this._emitter.attribute.all.filter((a) => a.subj === this._id)
  }
}
