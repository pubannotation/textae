import Transition from './Transition'
import bindTransition from './bindTransition'
import { MODE } from '../../../../MODE'
import pushView from './pushView'
import pushTerm from './pushTerm'
import pushSimple from './pushSimple'
import upSimple from './upSimple'
import changeByShortcut from './changeByShortcut'

export default class {
  constructor(editor, annotationData, typeEditor, displayInstance) {
    const transition = new Transition(editor, typeEditor, displayInstance)
    this._stateMachine = bindTransition(transition)
    this._annotationData = annotationData
  }

  get isSimple() {
    return (
      this._stateMachine.currentState === MODE.EDIT_DENOTATION_WITHOUT_RELATION
    )
  }

  get isEditEntity() {
    return (
      this._stateMachine.currentState === MODE.EDIT_DENOTATION_WITH_RELATION
    )
  }

  // For an intiation transition on an annotations data loaded.
  toEditDenotationWithoutRelation() {
    this._stateMachine.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
  }

  toEditDenotationWithRelation() {
    this._stateMachine.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
  }

  toViewWithoutRelation() {
    this._stateMachine.setState(MODE.VIEW_WITHOUT_RELATION)
  }

  toViewWithRelation() {
    this._stateMachine.setState(MODE.VIEW_WITH_RELATION)
  }

  // For buttan actions.
  pushView() {
    pushView(this._stateMachine)
  }

  pushTerm() {
    pushTerm(this._stateMachine, this._annotationData)
  }

  pushRelation() {
    this._stateMachine.setState(MODE.EDIT_RELATION)
  }

  pushSimple() {
    pushSimple(this._stateMachine)
  }

  upSimple() {
    upSimple(this._stateMachine)
  }

  toggleSimple() {
    switch (this._stateMachine.currentState) {
      case MODE.EDIT_DENOTATION_WITHOUT_RELATION:
        this._stateMachine.setState(MODE.EDIT_DENOTATION_WITH_RELATION)
        break
      case MODE.VIEW_WITHOUT_RELATION:
        this._stateMachine.setState(MODE.VIEW_WITH_RELATION)
        break
      case MODE.EDIT_DENOTATION_WITH_RELATION:
        this._stateMachine.setState(MODE.EDIT_DENOTATION_WITHOUT_RELATION)
        break
      case MODE.VIEW_WITH_RELATION:
        this._stateMachine.setState(MODE.VIEW_WITHOUT_RELATION)
        break
      default:
        throw new Error(`Invalid state: ${this._stateMachine.currentState}`)
    }
  }

  // For key input of F or M.
  changeByShortcut() {
    changeByShortcut(this._stateMachine)
  }
}
