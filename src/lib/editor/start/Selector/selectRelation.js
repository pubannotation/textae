export default function(domPositionCache, relationId) {
  const connect = domPositionCache.toConnect(relationId)

  addUiSelectClass(connect)
}

function addUiSelectClass(connect) {
  if (connect && connect.select) connect.select()
}
