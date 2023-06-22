import { MODE } from '../../../../MODE'

export default class StateMachine {
  /**
   *
   * @param {import('../../../AnnotationData/RelationModelContainer').default} relationContainer
   * @param {import('./Transition').default} transition
   * @param {import('../..//FunctionAvailability').default} functionAvailability
   */
  constructor(relationContainer, eventEmitter, functionAvailability) {
    this._currentShowRelation = false
    this._currentState = MODE.INIT

    this._relationContainer = relationContainer
    this._eventEmitter = eventEmitter
    this._functionAvailability = functionAvailability
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
    const modes = this._availableModes

    // No mode to change.
    if (modes.length <= 1) {
      return
    }

    const currentIndex = modes.findIndex(
      (mode) => mode.name === this.currentState
    )

    if (currentIndex < modes.length - 1) {
      // Change to the next mode.
      this[modes[currentIndex + 1].funcName](this.nextShowRelation)
    } else {
      // Change to the first mode.
      this[modes[0].funcName](this.nextShowRelation)
    }
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

  // Look at Function Availability and return the possible transition modes.
  get _availableModes() {
    const all = [
      {
        name: MODE.VIEW,
        availabilityName: 'view mode',
        funcName: 'toViewMode'
      },
      {
        name: MODE.EDIT_DENOTATION,
        availabilityName: 'term edit mode',
        funcName: 'toTermMode'
      },
      {
        name: MODE.EDIT_BLOCK,
        availabilityName: 'block edit mode',
        funcName: 'toBlockMode'
      },
      {
        name: MODE.EDIT_RELATION,
        availabilityName: 'relation edit mode',
        funcName: 'toRelationMode'
      }
    ]

    return all.filter((mode) =>
      this._functionAvailability.get(mode.availabilityName)
    )
  }
}
