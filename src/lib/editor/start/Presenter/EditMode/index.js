import Transition from './Transition'
import bindTransition from './bindTransition'
import state from './state'
import pushView from './pushView'
import pushTerm from './pushTerm'
import pushSimple from './pushSimple'
import upSimple from './upSimple'
import toggleInstaceRelation from './toggleInstaceRelation'

export default class {
  constructor(editor, annotationData, typeEditor, displayInstance) {
    const transition = new Transition(editor, typeEditor, displayInstance)
    this._stateMachine = bindTransition(transition)
    this._annotationData = annotationData
  }

  get isSimple() {
    return this._stateMachine.currentState === state.TERM
  }

  // For an intiation transition on an annotations data loaded.
  toTerm() {
    this._stateMachine.setState(state.TERM)
  }

  toInstance() {
    this._stateMachine.setState(state.INSTANCE)
  }

  toViewTerm() {
    this._stateMachine.setState(state.VIEW_TERM)
  }

  toViewInstance() {
    this._stateMachine.setState(state.VIEW_INSTANCE)
  }

  // For buttan actions.
  pushView() {
    pushView(this._stateMachine)
  }

  pushTerm() {
    pushTerm(this._stateMachine, this._annotationData)
  }

  pushRelation() {
    this._stateMachine.setState(state.RELATION)
  }

  pushSimple() {
    pushSimple(this._stateMachine)
  }

  upSimple() {
    upSimple(this._stateMachine)
  }

  toggleSimple() {
    switch (this._stateMachine.currentState) {
      case state.TERM:
        this._stateMachine.setState(state.INSTANCE)
        break
      case state.VIEW_TERM:
        this._stateMachine.setState(state.VIEW_INSTANCE)
        break
      case state.INSTANCE:
        this._stateMachine.setState(state.TERM)
        break
      case state.VIEW_INSTANCE:
        this._stateMachine.setState(state.VIEW_TERM)
        break
      default:
        throw new Error(`Invalid state: ${this._stateMachine.currentState}`)
    }
  }

  // For key input of F or M.
  toggleInstaceRelation() {
    toggleInstaceRelation(this._stateMachine, this._annotationData)
  }
}
