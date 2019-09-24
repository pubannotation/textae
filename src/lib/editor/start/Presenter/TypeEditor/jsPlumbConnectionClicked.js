// A relation is drawn by a jsPlumbConnection.
// The EventHandlar for clieck event of jsPlumbConnection.
export default function(elementEditor, jsPlumbConnection, event) {
  // Check the event is processed already.
  // Because the jsPlumb will call the event handler twice
  // when a label is clicked that of a relation added after the initiation.
  if (
    elementEditor.getHandler().jsPlumbConnectionClicked &&
    !event.processedByTextae
  ) {
    elementEditor
      .getHandler()
      .jsPlumbConnectionClicked(jsPlumbConnection, event)
  }
  event.processedByTextae = true
}
