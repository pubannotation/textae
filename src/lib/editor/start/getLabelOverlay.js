import LABEL from './LABEL'

export default function(jsPlumbConnection) {
  // Find the label overlay by self, because the function 'getLabelOverlays' returns no label overlay.
  const labelOverlay = jsPlumbConnection.getOverlay(LABEL.id)
  if (!labelOverlay) {
    throw new Error('no label overlay')
  }

  return labelOverlay
}
