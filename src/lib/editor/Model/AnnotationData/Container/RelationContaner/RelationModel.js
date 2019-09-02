export default class RelationModel {
  constructor({ id, pred, subj, obj }) {
    this._id = id
    this._type = pred
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
    return this._type
  }

  set type(val) {
    this._type = val
  }

  get subj() {
    return this._subj
  }

  get obj() {
    return this._obj
  }
}
