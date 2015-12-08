import arrangePositionOfPane from './arrangePositionOfPane'

export default function removeNoEntityPaneElement(paneElement) {
  if (!paneElement) {
    return
  }

  if (paneElement.children.length) {
    // Arrage the position of TypePane, because number of entities decrease.
    arrangePositionOfPane(paneElement)
  } else {
    let typeDom = paneElement.parentNode,
      gridDom = typeDom.parentNode

    // Remove type unlese entity.
    typeDom.remove()

    // Remove grid unless type.
    if (!gridDom.children.length) {
      gridDom.remove()
    }
  }
}
