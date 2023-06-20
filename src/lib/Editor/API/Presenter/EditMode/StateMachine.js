import { MODE } from '../../../../MODE'

export default class StateMachine {
  /**
   *
   * @param {import('../../../AnnotationData/RelationModelContainer').default} relationContainer
   * @param {import('./Transition').default} transition
   */
  constructor(relationContainer, transition) {
    this._relationContainer = relationContainer
    this._showRelation = false
    this._transition = transition
    this._currentState = MODE.INIT
  }

  get currentState() {
    return this._currentState
  }

  setState(state, showRelation) {
    this._showRelation = showRelation

    switch (state) {
      case MODE.VIEW_WITHOUT_RELATION:
        this._currentState = MODE.VIEW_WITHOUT_RELATION
        if (showRelation) {
          this._transition.toViewWithRelation()
        } else {
          this._transition.toViewWithoutRelation()
        }
        break
      case MODE.VIEW_WITH_RELATION:
        this._currentState = MODE.VIEW_WITH_RELATION
        if (showRelation) {
          this._transition.toViewWithRelation()
        } else {
          this._transition.toViewWithoutRelation()
        }
        break
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this._currentState = MODE.EDIT_DENOTATION_WITHOUT_RELATION
        if (showRelation) {
          this._transition.toEditDenotationWithoutRelation()
        } else {
          this._transition.toEditDenotationWithoutRelation()
        }
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this._currentState = MODE.EDIT_DENOTATION_WITH_RELATION
        if (showRelation) {
          this._transition.toEditDenotationWithRelation()
        } else {
          this._transition.toEditDenotationWithoutRelation()
        }
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
        this._currentState = MODE.EDIT_BLOCK_WITHOUT_RELATION
        if (showRelation) {
          this._transition.toEditBlockWithoutRelation()
        } else {
          this._transition.toEditBlockWithoutRelation()
        }
        break
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this._currentState = MODE.EDIT_BLOCK_WITH_RELATION
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
        if (this._relationContainer.some) {
          this.setState(MODE.VIEW_WITH_RELATION, true)
        } else {
          this.setState(MODE.VIEW_WITHOUT_RELATION, false)
        }
        break
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
        this.setState(MODE.VIEW_WITHOUT_RELATION, false)
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this.setState(MODE.VIEW_WITH_RELATION)
        break
      default:
      // Do nothing.
    }
  }

  toTermMode() {
    switch (this.currentState) {
      case MODE.EDIT_RELATION:
        if (this._relationContainer.some) {
          this.setState(MODE.EDIT_DENOTATION_WITH_RELATION, true)
        } else {
          this.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION, false)
        }
        break
      case MODE.VIEW_WITH_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITH_RELATION, true)
        break
      case MODE.VIEW_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION, false)
        break
      default:
      // Do nothing.
    }
  }

  toBlockMode() {
    switch (this.currentState) {
      case MODE.EDIT_RELATION:
        if (this._relationContainer.some) {
          this.setState(MODE.EDIT_BLOCK_WITH_RELATION, true)
        } else {
          this.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION, false)
        }
        break
      case MODE.VIEW_WITH_RELATION:
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITH_RELATION, true)
        break
      case MODE.VIEW_WITHOUT_RELATION:
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION, false)
        break
      default:
      // Do nothing.
    }
  }

  toRelationMode() {
    this.setState(MODE.EDIT_RELATION, true)
  }

  toggleSimpleMode() {
    switch (this.currentState) {
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITH_RELATION, true)
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITH_RELATION, true)
        break
      case MODE.VIEW_WITHOUT_RELATION:
        this.setState(MODE.VIEW_WITH_RELATION)
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION, false)
        break
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION, false)
        break
      case MODE.VIEW_WITH_RELATION:
        this.setState(MODE.VIEW_WITHOUT_RELATION, false)
        break
      default:
        throw new Error(`Invalid state: ${this.currentState}`)
    }
  }

  changeModeByShortcut() {
    switch (this.currentState) {
      case MODE.VIEW_WITH_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITH_RELATION, true)
        break
      case MODE.VIEW_WITHOUT_RELATION:
        this.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION, false)
        break
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITHOUT_RELATION, false)
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this.setState(MODE.EDIT_BLOCK_WITH_RELATION, true)
        break
      case MODE.EDIT_BLOCK_WITHOUT_RELATION:
      case MODE.EDIT_BLOCK_WITH_RELATION:
        this.setState(MODE.EDIT_RELATION, true)
        break
      case MODE.EDIT_RELATION:
        if (this._relationContainer.some) {
          this.setState(MODE.VIEW_WITH_RELATION)
        } else {
          this.setState(MODE.VIEW_WITHOUT_RELATION, false)
        }
        break
      default:
      // Do nothing.
    }
  }
}
