// Manage the original annotations and the original configuration and merge the changes when you save them.
export default class OriginalData {
  constructor() {
    this._map = new Map()
  }

  get annotation() {
    return this._map.get('annotation') || {}
  }

  set annotation(annotation) {
    this._map.set('annotation', annotation)
  }

  get configuration() {
    return this._map.has('configuration')
      ? this._map.get('configuration').data
      : {}
  }

  set configuration(dataSource) {
    this._map.set('configuration', dataSource)
  }
}
