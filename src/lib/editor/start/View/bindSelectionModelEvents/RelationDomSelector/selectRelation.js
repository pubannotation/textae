export default function(domPositionCache, relation) {
  const connect = domPositionCache.getConnect(relation.id)

  addUiSelectClass(connect)
}

function addUiSelectClass(connect) {
  if (connect && connect.select) connect.select()
}
