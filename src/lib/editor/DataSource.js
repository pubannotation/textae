import toSourceStrin from './start/toSourceString'

export default class DataSource {
  constructor(type, id, data) {
    this._type = type
    this._id = id
    this._data = data
  }

  get type() {
    return this._type
  }

  get data() {
    return this._data
  }

  get displayName() {
    return toSourceStrin(this._type, this._id)
  }
}
