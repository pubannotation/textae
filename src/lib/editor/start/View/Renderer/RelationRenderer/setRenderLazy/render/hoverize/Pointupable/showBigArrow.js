import arrowConfig from '../../arrowConfig'

export default function(jsPlumbConnection) {
  if (jsPlumbConnection.getOverlay(arrowConfig.hover.id)) {
    return
  }

  // Remove a normal arrow and add a new big arrow.
  // Because an arrow is out of position if hideOverlay and showOverlay is used.
  jsPlumbConnection.removeOverlay(arrowConfig.normal.id)
  jsPlumbConnection.addOverlay(['Arrow', arrowConfig.hover])
}
