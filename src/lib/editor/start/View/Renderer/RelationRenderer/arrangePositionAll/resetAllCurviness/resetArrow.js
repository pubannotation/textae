export default function(jsPlumbConnection) {
  for (const overlay of jsPlumbConnection.getOverlays()) {
    if (overlay.type === 'Arrow') {
      jsPlumbConnection.removeOverlays(overlay.id)
      jsPlumbConnection.addOverlay([
        'Arrow',
        {
          id: overlay.id,
          width: overlay.width,
          length: overlay.length,
          location: overlay.loc
        }
      ])
    }
  }
}
