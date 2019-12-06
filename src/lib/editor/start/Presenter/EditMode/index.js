import Transition from './Transition'
import bindTransition from './bindTransition'
import enableButtonHasAnnotation from './enableButtonHasAnnotation'
import state from './state'
import pushView from './pushView'
import pushTerm from './pushTerm'
import pushSimple from './pushSimple'
import upSimple from './upSimple'
import toggleInstaceRelation from './toggleInstaceRelation'

export default class {
  constructor(
    editor,
    annotationData,
    selectionModel,
    typeEditor,
    buttonStateHelper,
    displayInstance
  ) {
    const transition = new Transition(
      editor,
      annotationData,
      selectionModel,
      typeEditor,
      buttonStateHelper,
      displayInstance
    )
    this._stateMachine = bindTransition(transition)
    this._annotationData = annotationData

    this._stateMachine.once('transition', () =>
      enableButtonHasAnnotation(buttonStateHelper)
    )
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

  // For key input of F or M.
  toggleInstaceRelation() {
    toggleInstaceRelation(this._stateMachine, this._annotationData)
  }
}
