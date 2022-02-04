import toSourceString from './toSourceString'

export default class DataSource {
  constructor(type, id, data) {
    this._type = type
    this._id = id
    this._data = data
  }

  get type() {
    return this._type
  }

  get id() {
    return this._id
  }

  get data() {
    return this._data
  }

  get displayName() {
    return toSourceString(this._type, this._id)
  }
}
