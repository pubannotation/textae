export default function(domPositionCache, relation) {
  const connect = domPositionCache.getConnect(relation.id)

  if (connect && connect.select) connect.select()
}
