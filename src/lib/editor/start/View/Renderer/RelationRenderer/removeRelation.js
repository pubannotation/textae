export default function(jsPlumbInstance, relation) {
  const jsPlumbConnection = relation.jsPlumbConnection
  jsPlumbInstance.detach(jsPlumbConnection)
  // Set the flag dead already to delay selection.
  jsPlumbConnection.dead = true
  // Set a flag to extract relations from target to move relations asynchronously.
  relation.removed = true
}
