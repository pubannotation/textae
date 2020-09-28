export default function(relations) {
  for (const { jsPlumbConnection } of relations) {
    jsPlumbConnection.select()
  }
}
