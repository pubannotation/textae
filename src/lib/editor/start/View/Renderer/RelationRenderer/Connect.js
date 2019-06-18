import DomPositionCache from '../../DomPositionCache'

export default function(editor, annotationData, relationId) {
  var domPositionCache = new DomPositionCache(editor, annotationData.entity)
  var connect = domPositionCache.toConnect(relationId)

  if (!connect) {
    throw new Error('no connect for id: ' + relationId)
  }

  return connect
}
