import LesserMap from './LesserMap'

export default class {
  constructor() {
    this._newCache = new LesserMap()
  }

  // The connectCache has jsPlumbConnectors to call jsPlumbConnector instance to edit an according dom object.
  get connectCache() {
    return this._newCache
  }
}
