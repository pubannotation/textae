import { MODE } from '../../../../MODE'

export default class StateMachine {
  /**
   *
   * @param {import('../../../AnnotationData/RelationModelContainer').default} relationContainer
   * @param {import('./Transition').default} transition
   */
  constructor(relationContainer, transition) {
    this._relationContainer = relationContainer
    this._currentShowRelation = false
    this._transition = transition
    this._currentState = MODE.INIT
  }

  get currentState() {
    return this._currentState
  }

  setState(state, showRelation) {
    this._currentShowRelation = showRelation

    switch (state) {
      case MODE.VIEW:
        this._currentState = MODE.VIEW
        if (showRelation) {
          this._transition.toViewWithRelation()
        } else {
          this._transition.toViewWithoutRelation()
        }
        break

      case MODE.EDIT_DENOTATION:
        this._currentState = MODE.EDIT_DENOTATION
        if (showRelation) {
          this._transition.toEditDenotationWithRelation()
        } else {
          this._transition.toEditDenotationWithoutRelation()
        }
        break

      case MODE.EDIT_BLOCK:
        this._currentState = MODE.EDIT_BLOCK
        if (showRelation) {
          this._transition.toEditBlockWithRelation()
        } else {
          this._transition.toEditBlockWithoutRelation()
        }
        break

      case MODE.EDIT_RELATION:
        this._currentState = MODE.EDIT_RELATION
        this._transition.toEditRelation()
        break
      default:
        throw new Error(`Invalid state: ${state}`)
    }
  }

  toViewMode() {
    switch (this.currentState) {
      case MODE.EDIT_RELATION:
        this.setState(MODE.VIEW, this._relationContainer.some)
        break
      case MODE.EDIT_DENOTATION:
      case MODE.EDIT_BLOCK:
        this.setState(MODE.VIEW, this._currentShowRelation)
        break
      default:
      // Do nothing.
    }
  }

  toTermMode() {
    switch (this.currentState) {
      case MODE.EDIT_RELATION:
        this.setState(MODE.EDIT_DENOTATION, this._relationContainer.some)
        break
      case MODE.VIEW:
      case MODE.EDIT_BLOCK:
        this.setState(MODE.EDIT_DENOTATION, this._currentShowRelation)
        break
      default:
      // Do nothing.
    }
  }

  toBlockMode() {
    switch (this.currentState) {
      case MODE.EDIT_RELATION:
        this.setState(MODE.EDIT_BLOCK, this._relationContainer.some)
        break
      case MODE.VIEW:
      case MODE.EDIT_DENOTATION:
        this.setState(MODE.EDIT_BLOCK, this._currentShowRelation)
        break
      default:
      // Do nothing.
    }
  }

  toRelationMode() {
    this.setState(MODE.EDIT_RELATION)
  }

  toggleSimpleMode() {
    switch (this.currentState) {
      case MODE.EDIT_DENOTATION:
        this.setState(MODE.EDIT_DENOTATION, !this._currentShowRelation)
        break
      case MODE.EDIT_BLOCK:
        this.setState(MODE.EDIT_BLOCK, !this._currentShowRelation)
        break
      case MODE.VIEW:
        this.setState(MODE.VIEW, !this._currentShowRelation)
        break
      default:
        throw new Error(`Invalid state: ${this.currentState}`)
    }
  }

  changeModeByShortcut() {
    switch (this.currentState) {
      case MODE.VIEW:
        this.setState(MODE.EDIT_DENOTATION, this._currentShowRelation)
        break
      case MODE.EDIT_DENOTATION:
        this.setState(MODE.EDIT_BLOCK, this)
        break
      case MODE.EDIT_BLOCK:
        this.setState(MODE.EDIT_RELATION)
        break
      case MODE.EDIT_RELATION:
        this.setState(MODE.VIEW, this._relationContainer.some)
        break
      default:
      // Do nothing.
    }
  }
}
