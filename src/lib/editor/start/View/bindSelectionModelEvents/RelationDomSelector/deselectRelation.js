export default function(domPositionCache, relation) {
  const connect = domPositionCache.getConnect(relation.id)

  removeUiSelectClass(connect)
}

function removeUiSelectClass(connect) {
  if (connect && connect.deselect) connect.deselect()
}
