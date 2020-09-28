import addArrow from './addArrow'

export default function(js_plumb_conncetion) {
  for (const overlay of js_plumb_conncetion.getOverlays()) {
    if (overlay.type === 'Arrow') {
      const id = overlay.id
      js_plumb_conncetion.removeOverlays(id)
      addArrow(id, js_plumb_conncetion)
    }
  }
}
