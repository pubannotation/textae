import state from './state'
import isSimple from '../isSimple'

export default function(stateMachine, annotationData) {
  return {
    // For an intiation transition on an annotations data loaded.
    toTerm: () => stateMachine.setState(state.TERM),
    toInstance: () => stateMachine.setState(state.INSTANCE),
    toViewTerm: () => stateMachine.setState(state.VIEW_TERM),
    toViewInstance: () => stateMachine.setState(state.VIEW_INSTANCE),
    // For buttan actions.
    pushView: () => pushView(stateMachine),
    pushTerm: () => pushTerm(stateMachine, annotationData),
    pushRelation: () => stateMachine.setState(state.RELATION),
    pushSimple: () => pushSimple(stateMachine),
    upSimple: () => upSimple(stateMachine),
    // For key input of F or M.
    toggleInstaceRelation: () =>
      toggleInstaceRelation(stateMachine, annotationData)
  }
}

function pushView(stateMachine) {
  switch (stateMachine.currentState) {
    case state.TERM:
      stateMachine.setState(state.VIEW_TERM)
      break
    case state.INSTANCE:
    case state.RELATION:
      stateMachine.setState(state.VIEW_INSTANCE)
      break
    default:
    // Do nothig.
  }
}

function pushTerm(stateMachine, annotationData) {
  switch (stateMachine.currentState) {
    case state.RELATION:
      toEditStateAccordingToAnntationData(stateMachine, annotationData)
      break
    case state.VIEW_INSTANCE:
      stateMachine.setState(state.INSTANCE)
      break
    case state.VIEW_TERM:
      stateMachine.setState(state.TERM)
      break
    default:
    // Do nothig.
  }
}

function pushSimple(stateMachine) {
  switch (stateMachine.currentState) {
    case state.INSTANCE:
      stateMachine.setState(state.TERM)
      break
    case state.VIEW_INSTANCE:
      stateMachine.setState(state.VIEW_TERM)
      break
    default:
      throw new Error(`Invalid state: ${stateMachine.currentState}`)
  }
}

function upSimple(stateMachine) {
  switch (stateMachine.currentState) {
    case state.TERM:
      stateMachine.setState(state.INSTANCE)
      break
    case state.VIEW_TERM:
      stateMachine.setState(state.VIEW_INSTANCE)
      break
    default:
      throw new Error(`Invalid state: ${stateMachine.currentState}`)
  }
}

function toggleInstaceRelation(stateMachine, annotationData) {
  switch (stateMachine.currentState) {
    case state.TERM:
    case state.INSTANCE:
      stateMachine.setState(state.RELATION)
      break
    case state.RELATION:
      toEditStateAccordingToAnntationData(stateMachine, annotationData)
      break
    default:
    // Do nothig.
  }
}

function toEditStateAccordingToAnntationData(stateMachine, annotationData) {
  if (isSimple(annotationData)) {
    stateMachine.setState(state.TERM)
  } else {
    stateMachine.setState(state.INSTANCE)
  }
}
