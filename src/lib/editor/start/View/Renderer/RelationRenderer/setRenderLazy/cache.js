import DomPositionCache from '../../../DomPositionCache'

// Cache a connect instance.
 export default function(connect, editor, annotationData) {
  const relationId = connect.relationId
  const domPositionCache = new DomPositionCache(editor, annotationData.entity)
  domPositionCache.connectCache.set(relationId, connect)
  return connect
}
