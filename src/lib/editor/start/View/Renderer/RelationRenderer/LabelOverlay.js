import LABEL from './LABEL'

export default function(connect) {
  // Find the label overlay by self, because the function 'getLabelOverlays' returns no label overlay.
  const labelOverlay = connect.getOverlay(LABEL.id)
  if (!labelOverlay) {
    throw new Error('no label overlay')
  }

  return labelOverlay
}
