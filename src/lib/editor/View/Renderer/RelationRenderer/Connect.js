import DomPositionCache from '../../DomPositionCache'

export default function(editor, annotationData, relationId) {
  var domPositionCaChe = new DomPositionCache(editor, annotationData.entity)
  var connect = domPositionCaChe.toConnect(relationId)

  if (!connect) {
    throw new Error('no connect for id: ' + relationId)
  }

  return connect
}
