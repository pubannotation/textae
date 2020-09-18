export default function(domPositionCache, relationId) {
  const connect = domPositionCache.getConnect(relationId)

  removeUiSelectClass(connect)
}

function removeUiSelectClass(connect) {
  if (connect && connect.deselect) connect.deselect()
}
