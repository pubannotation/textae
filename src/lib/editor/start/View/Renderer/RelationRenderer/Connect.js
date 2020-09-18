import getDomPositionCache from '../../getDomPositionCache'

export default function(editor, annotationData, relationId) {
  const domPositionCache = getDomPositionCache(editor, annotationData.entity)
  const connect = domPositionCache.getConnect(relationId)

  if (!connect) {
    throw new Error(`no connect for id: ${relationId}`)
  }

  return connect
}
