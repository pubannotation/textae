import DataSource from '../DataSource'
import patchConfiguration from './patchConfiguration'

// Manage the original annotations and the original configuration and merge the changes when you save them.
export default class OriginalData {
  constructor(editor, statusBar) {
    this._eventEmitter = editor.eventEmitter
    this._statusBar = statusBar
    this._map = new Map()
  }

  get defaultAnnotation() {
    return {
      text: 'Currently, the document is empty. Use the `import` button or press the key `i` to open a document with annotation.'
    }
  }

  get defaultConfiguration() {
    return patchConfiguration(this.defaultAnnotation)
  }

  get annotation() {
    return this._map.has('annotation')
      ? this._map.get('annotation').data
      : this.defaultAnnotation
  }

  set annotation(dataSource) {
    this._map.set('annotation', dataSource)
    if (dataSource.data.config) {
      this.configuration = new DataSource(null, null, dataSource.data.config)
    }

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
    this._eventEmitter.emit('textae-event.orginal-data.configuration.reset')
  }
}
