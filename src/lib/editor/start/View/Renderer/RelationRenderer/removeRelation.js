import Connect from './Connect'

export default function(editor, jsPlumbInstance, domPositionCache, relation) {
  const connect = new Connect(editor, relation.id)
  jsPlumbInstance.detach(connect)
  domPositionCache.removeConnect(relation.id)
  // Set the flag dead already to delay selection.
  connect.dead = true
  // Set a flag to extract relations from target to move relations asynchronously.
  relation.removed = true
}
