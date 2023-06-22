import { MODE } from '../../../../MODE'

export default class StateMachine {
  /**
   *
   * @param {import('../../../AnnotationData/RelationModelContainer').default} relationContainer
   * @param {import('./Transition').default} transition
   */
  constructor(relationContainer, eventEmitter) {
    this._currentShowRelation = false
    this._currentState = MODE.INIT

    this._relationContainer = relationContainer
    this._eventEmitter = eventEmitter
  }

  get currentState() {
    return this._currentState
  }

  toViewMode(showRelation) {
    this._currentShowRelation = showRelation
    this._currentState = MODE.VIEW
    this._emit()
  }

  toTermMode(showRelation) {
    this._currentShowRelation = showRelation
    this._currentState = MODE.EDIT_DENOTATION
    this._emit()
  }

  toBlockMode(showRelation) {
    this._currentShowRelation = showRelation
    this._currentState = MODE.EDIT_BLOCK
    this._emit()
  }

  toRelationMode() {
    this._currentShowRelation = true
    this._currentState = MODE.EDIT_RELATION
    this._emit()
  }

  toggleSimpleMode() {
    switch (this.currentState) {
      case MODE.EDIT_DENOTATION:
        this.toTermMode(!this._currentShowRelation)
        break
      case MODE.EDIT_BLOCK:
        this.toBlockMode(!this._currentShowRelation)
        break
      case MODE.VIEW:
        this.toViewMode(!this._currentShowRelation)
        break
      default:
        throw new Error(`Invalid state: ${this.currentState}`)
    }
  }

  changeModeByShortcut() {
    const modes = [
      MODE.VIEW,
      MODE.EDIT_DENOTATION,
      MODE.EDIT_BLOCK,
      MODE.EDIT_RELATION
    ]

    let current = false
    for (const mode of modes) {
      if (current) {
        this[`to${mode}Mode`](this.nextShowRelation)
        return
      }

      if (this.currentState === mode) {
        current = true
        continue
      }
    }

    this.toViewMode(this.nextShowRelation)
  }

  get nextShowRelation() {
    if (this._currentState === MODE.EDIT_RELATION) {
      return this._relationContainer.some
    } else {
      return this._currentShowRelation
    }
  }

  _emit() {
    this._eventEmitter.emit(
      'textae-event.edit-mode.transition',
      this._currentState,
      this._currentShowRelation
    )
  }
}
