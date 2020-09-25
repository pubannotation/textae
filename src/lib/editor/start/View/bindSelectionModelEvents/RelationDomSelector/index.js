import getDomPositionCache from '../../getDomPositionCache'
import selectRelation from './selectRelation'
import deselectRelation from './deselectRelation'

export default class {
  constructor(editor) {
    this._domPositionCache = getDomPositionCache(editor)
  }

  select(relation) {
    selectRelation(this._domPositionCache, relation)
  }

  deselect(relation) {
    deselectRelation(this._domPositionCache, relation)
  }
}
