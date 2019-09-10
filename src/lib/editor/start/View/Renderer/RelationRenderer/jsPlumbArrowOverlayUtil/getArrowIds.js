export default function(js_plumb_conncetion) {
  return js_plumb_conncetion
    .getOverlays()
    .filter((overlay) => overlay.type === 'Arrow')
    .map((arrow) => arrow.id)
}
