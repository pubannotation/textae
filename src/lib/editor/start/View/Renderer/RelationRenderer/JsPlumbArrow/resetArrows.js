import addArrow from './addArrow'

export default function(jsPlumbConnection) {
  for (const overlay of jsPlumbConnection.getOverlays()) {
    if (overlay.type === 'Arrow') {
      const id = overlay.id
      jsPlumbConnection.removeOverlays(id)
      addArrow(id, jsPlumbConnection)
    }
  }
}
