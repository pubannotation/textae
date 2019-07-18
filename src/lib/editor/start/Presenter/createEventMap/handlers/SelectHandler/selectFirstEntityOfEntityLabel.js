export default function(selectionModel, label) {
  const pane = label.previousElementSibling

  selectionModel.selectEntity(pane.children[0])
}
