import LabelOverlay from '../../LabelOverlay'
import extendPointup from './extendPointup'

// Set hover action.
export default function(editor, annotationData, typeContainer, connect, relationId) {
  extendRelationId(connect, relationId)
  extendPointup(editor, annotationData, typeContainer, connect)
  bindConnect(connect)
  bindLabel(connect)
  return connect
}

// The relation id needs to be embedded in the jsPlumb connector instance.
//
// When hovering the relation, the connector of the relationship is broadened.
// At that time, the color of the connector is required.
// Colors are obtained by type from the type container.
// Type is obtained from the model by the relation ID.
function extendRelationId(connect, relationId) {
  return Object.assign(connect, {
    relationId
  })
}

function bindConnect(connect) {
  bindHoverAction(connect, (connect) => connect.pointup(), (connect) => connect.pointdown())
}

function bindLabel(connect) {
  bindHoverAction(new LabelOverlay(connect), (label) => label.component.pointup(), (label) => label.component.pointdown())
}

function bindHoverAction(jsPlumbElement, onMouseOver, onMouseRemove) {
  jsPlumbElement.bind('mouseenter', onMouseOver).bind('mouseexit', onMouseRemove)
}
