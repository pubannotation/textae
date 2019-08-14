// Manage the original annotations and the original configuration and merge the changes when you save them.
export default class OriginalData {
  constructor() {
    this._map = new Map()
  }
  get annotation() {
    return this._map.get('annotation')
  }
  get configuration() {
    return this._map.get('configuration')
  }
  set annotation(annotation) {
    this._map.set('annotation', annotation)
  }
  set configuration(configuration) {
    this._map.set('configuration', configuration)
  }
}
