export default function(connect) {
  return connect
    .getOverlays()
    .filter((overlay) => overlay.type === 'Arrow')
    .map((arrow) => arrow.id)
}
