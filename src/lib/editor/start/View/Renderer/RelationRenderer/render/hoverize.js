import LabelOverlay from '../LabelOverlay'
import extendPointup from './extendPointup'

// Set hover action.
export default function(editor, annotationData, typeContainer, connect) {
  extendPointup(editor, annotationData, typeContainer, connect)
  bindConnect(connect)
  bindLabel(connect)
  return connect
}

function bindHoverAction(jsPlumbElement, onMouseOver, onMouseRemove) {
  jsPlumbElement.bind('mouseenter', onMouseOver).bind('mouseexit', onMouseRemove)
}

function bindConnect(connect) {
  bindHoverAction(connect, (connect) => connect.pointup(), (connect) => connect.pointdown())
}

function bindLabel(connect) {
  bindHoverAction(new LabelOverlay(connect), (label) => label.component.pointup(), (label) => label.component.pointdown())
}
