import getDomPositionCache from '../../getDomPositionCache'

export default function(editor, relationId) {
  const domPositionCache = getDomPositionCache(editor)
  const connect = domPositionCache.getConnect(relationId)

  if (!connect) {
    throw new Error(`no connect for id: ${relationId}`)
  }

  return connect
}
