import getDomPositionCache from '../../../../getDomPositionCache'

// Cache a connect instance.
export default function(connect, editor) {
  const relationId = connect.relationId
  const domPositionCache = getDomPositionCache(editor)
  domPositionCache.setConnect(relationId, connect)
  return connect
}
