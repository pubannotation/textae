import getDomPositionCache from '../../getDomPositionCache'
import selectRelation from './selectRelation'
import deselectRelation from './deselectRelation'

export default class {
  constructor(editor, annotationData) {
    this._domPositionCache = getDomPositionCache(editor, annotationData.entity)
  }

  select(id) {
    selectRelation(this._domPositionCache, id)
  }

  deselect(id) {
    deselectRelation(this._domPositionCache, id)
  }
}
