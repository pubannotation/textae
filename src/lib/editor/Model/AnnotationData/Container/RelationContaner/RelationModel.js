import TypeModel from '../SpanContainer/TypeModel'

export default class RelationModel {
  constructor({ id, pred, subj, obj }) {
    this._id = id
    this._typeName = pred
    this._subj = subj
    this._obj = obj
  }

  get id() {
    return this._id
  }

  set id(val) {
    this._id = val
  }

  get type() {
    return new TypeModel(this._typeName, null)
  }

  set type(val) {
    this._typeName = val
  }

  get subj() {
    return this._subj
  }

  get obj() {
    return this._obj
  }
}
