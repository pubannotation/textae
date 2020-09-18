export default function(domPositionCache, relationId) {
  const connect = domPositionCache.getConnect(relationId)

  addUiSelectClass(connect)
}

function addUiSelectClass(connect) {
  if (connect && connect.select) connect.select()
}
