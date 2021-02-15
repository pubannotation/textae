import DataSource from '../DataSource'

// Manage the original annotations and the original configuration and merge the changes when you save them.
export default class OriginalData {
  constructor(dataAccessObject, statusBar) {
    this._dataAccessObject = dataAccessObject
    this._statusBar = statusBar
    this._map = new Map()
  }

  get annotation() {
    return this._map.has('annotation') ? this._map.get('annotation').data : {}
  }

  set annotation(dataSource) {
    this._map.set('annotation', dataSource)
    if (dataSource.data.config) {
      this.configuration = new DataSource(null, null, dataSource.data.config)
    }

    this._dataAccessObject.annotationUrl = dataSource

    if (dataSource.type) {
      this._statusBar.status = dataSource
    }
  }

  get configuration() {
    return this._map.has('configuration')
      ? this._map.get('configuration').data
      : {}
  }

  set configuration(dataSource) {
    this._map.set('configuration', dataSource)
    this._dataAccessObject.configurationUrl = dataSource
  }
}
