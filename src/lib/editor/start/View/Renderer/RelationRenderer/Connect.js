import getDomPositionCache from '../../getDomPositionCache'

export default function(editor, relation) {
  const domPositionCache = getDomPositionCache(editor)
  const relationId = relation.id
  const connect = domPositionCache.getConnect(relationId)

  if (!connect) {
    throw new Error(`no connect for id: ${relationId}`)
  }

  return connect
}
