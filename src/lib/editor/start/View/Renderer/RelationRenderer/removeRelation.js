export default function(jsPlumbInstance, relation) {
  const connect = relation.connect
  jsPlumbInstance.detach(connect)
  // Set the flag dead already to delay selection.
  connect.dead = true
  // Set a flag to extract relations from target to move relations asynchronously.
  relation.removed = true
}
