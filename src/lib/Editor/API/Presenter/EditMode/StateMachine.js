import { MODE } from '../../../../MODE'
import Transition from './Transition'

export default class StateMachine {
  /**
   *
   * @param {import('../../../AnnotationData/RelationModelContainer').default} relationContainer
   * @param {import('./Transition').default} transition
   */
  constructor(
    relationContainer,
    eventEmitter,
    editorHTMLElement,
    typeGap,
    noEdit,
    editEntity,
    editBlock,
    editRelation
  ) {
    this._relationContainer = relationContainer
    this._currentShowRelation = false
    this._transition = new Transition(
      eventEmitter,
      editorHTMLElement,
      typeGap,
      noEdit,
      editEntity,
      editBlock,
      editRelation
    )
    this._currentState = MODE.INIT
  }

  get currentState() {
    return this._currentState
  }

  toViewMode(showRelation) {
    this._currentShowRelation = showRelation
    this._currentState = MODE.VIEW
    this._transition.toView(showRelation)
  }

  toTermMode(showRelation) {
    this._currentShowRelation = showRelation
    this._currentState = MODE.EDIT_DENOTATION
    this._transition.toEditDenotation(showRelation)
  }

  toBlockMode(showRelation) {
    this._currentShowRelation = showRelation
    this._currentState = MODE.EDIT_BLOCK
    this._transition.toEditBlock(showRelation)
  }

  toRelationMode() {
    this._currentState = MODE.EDIT_RELATION
    this._transition.toEditRelation()
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
    switch (this.currentState) {
      case MODE.VIEW:
        this.toTermMode(this.nextShowRelation)
        break
      case MODE.EDIT_DENOTATION:
        this.toBlockMode(this.nextShowRelation)
        break
      case MODE.EDIT_BLOCK:
        this.toRelationMode()
        break
      case MODE.EDIT_RELATION:
        this.toViewMode(this.nextShowRelation)
        break
      default:
      // Do nothing.
    }
  }

  get nextShowRelation() {
    if (this._currentState === MODE.EDIT_RELATION) {
      return this._relationContainer.some
    } else {
      return this._currentShowRelation
    }
  }
}
