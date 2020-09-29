export default function(jsPlumbConnection, className) {
  return jsPlumbConnection.connector.canvas.classList.contains(className)
}
