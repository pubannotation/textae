import TypeModel from '../SpanContainer/TypeModel'

export default class {
  constructor(emitter, span, type, id = null) {
    this._span = span
    this._typeName = type
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
    // Replace null to 'null' if type is null and undefined too.
    return new TypeModel(String(this._typeName), this)
  }

  set type(val) {
    this._typeName = val
  }

  sameType(type, attributes) {
    let sameAttributeCounts = 0
    for (const attr of attributes) {
      if (
        this.type.attributes.find(
          (a) => a.pred === attr.pred && a.obj === attr.obj
        )
      ) {
        sameAttributeCounts++
      }
    }

    return this.type.name === type && attributes.length === sameAttributeCounts
  }

  get attributes() {
    return this._emitter.attribute.all.filter((a) => a.subj === this._id)
  }

  getDifferentAttributes(newAttributes) {
    return this.attributes.filter(
      (oldA) =>
        !newAttributes.some(
          (newA) => oldA.pred === newA.pred && oldA.obj === newA.obj
        )
    )
  }
}
