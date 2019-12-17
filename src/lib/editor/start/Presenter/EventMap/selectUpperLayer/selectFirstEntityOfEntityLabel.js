import getPaneDomOfType from '../../../../getPaneDomOfType'

export default function(selectionModel, label) {
  const pane = getPaneDomOfType(label)

  selectionModel.selectEntity(pane.children[0])
}
