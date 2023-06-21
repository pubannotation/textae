import { MODE } from '../../../../MODE'

export default class StateMachine {
  /**
   *
   * @param {import('../../../AnnotationData/RelationModelContainer').default} relationContainer
   * @param {import('./Transition').default} transition
   */
  constructor(
    relationContainer,
    eventEmitter,
    typeGap,
    view,
    editEntity,
    editBlock,
    editRelation
  ) {
    this._relationContainer = relationContainer
    this._currentShowRelation = false
    this._eventEmitter = eventEmitter
    this._typeGap = typeGap
    this._view = view
    this._editEntity = editEntity
    this._editBlock = editBlock
    this._editRelation = editRelation
    this._currentState = MODE.INIT
  }

  get currentState() {
    return this._currentState
  }

  toViewMode(showRelation) {
    this._currentShowRelation = showRelation
    this._currentState = MODE.VIEW
    this._typeGap.show = showRelation
    this._eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.VIEW,
      showRelation
    )

    this._view()
  }

  toTermMode(showRelation) {
    this._currentShowRelation = showRelation
    this._currentState = MODE.EDIT_DENOTATION
    this._typeGap.show = showRelation
    this._eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_DENOTATION,
      showRelation
    )

    this._editEntity()
  }

  toBlockMode(showRelation) {
    this._currentShowRelation = showRelation
    this._currentState = MODE.EDIT_BLOCK
    this._typeGap.show = showRelation
    this._eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_BLOCK,
      showRelation
    )

    this._editBlock()
  }

  toRelationMode() {
    this._currentState = MODE.EDIT_RELATION
    this._typeGap.show = true
    this._eventEmitter.emit(
      'textae-event.edit-mode.transition',
      MODE.EDIT_RELATION,
      true
    )

    this._editRelation()
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
