export default function(domPositionCache, relationId) {
  let connect = domPositionCache.toConnect(relationId)

  removeUiSelectClass(connect)
}

function removeUiSelectClass(connect) {
  if (connect && connect.deselect) connect.deselect()
}
