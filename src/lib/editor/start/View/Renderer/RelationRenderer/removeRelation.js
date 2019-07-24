import Connect from './Connect'

export default function(
  editor,
  annotationData,
  jsPlumbInstance,
  domPositionCache,
  relation
) {
  const connect = new Connect(editor, annotationData, relation.id)
  jsPlumbInstance.detach(connect)
  domPositionCache.connectCache.delete(relation.id)
  // Set the flag dead already to delay selection.
  connect.dead = true
  // Set a flag to extract relations from target to move relations asynchronously.
  relation.removed = true
}
