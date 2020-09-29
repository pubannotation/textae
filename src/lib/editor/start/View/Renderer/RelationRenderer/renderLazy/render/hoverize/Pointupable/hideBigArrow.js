import arrowConfig from '../../arrowConfig'

export default function(jsPlumbConnection) {
  if (jsPlumbConnection.getOverlay(arrowConfig.normal.id)) {
    return
  }

  jsPlumbConnection.removeOverlay(arrowConfig.hover.id)
  jsPlumbConnection.addOverlay(['Arrow', arrowConfig.normal])
}
