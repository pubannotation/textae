export default function(jsPlumbConnection) {
  // Find the label overlay by self, because the function 'getLabelOverlays' returns no label overlay.
  const labelOverlay = jsPlumbConnection.getOverlay('textae-relation-label')
  if (!labelOverlay) {
    throw new Error('no label overlay')
  }

  return labelOverlay
}
