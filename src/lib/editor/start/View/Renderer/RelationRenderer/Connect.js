import DomPositionCache from '../../DomPositionCache'

export default function(editor, annotationData, relationId) {
  const domPositionCache = new DomPositionCache(editor, annotationData.entity)
  const connect = domPositionCache.toConnect(relationId)

  if (!connect) {
    throw new Error('no connect for id: ' + relationId)
  }

  return connect
}
