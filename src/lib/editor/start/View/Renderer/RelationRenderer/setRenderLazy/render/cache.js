import getDomPositionCache from '../../../../getDomPositionCache'

// Cache a connect instance.
export default function(connect, editor, annotationData) {
  const relationId = connect.relationId
  const domPositionCache = getDomPositionCache(editor, annotationData.entity)
  domPositionCache.setConnect(relationId, connect)
  return connect
}
