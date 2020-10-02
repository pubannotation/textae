// A relation is drawn by a jsPlumbConnection.
// The EventHandlar for clieck event of jsPlumbConnection.
export default function(elementEditor, jsPlumbConnection, event) {
  if (elementEditor.getHandler().jsPlumbConnectionClicked) {
    elementEditor
      .getHandler()
      .jsPlumbConnectionClicked(jsPlumbConnection, event)
  }
}
