import getTypeDomOfEntityDom from '../../../getTypeDomOfEntityDom'
import arrangePositionOfPane from './arrangePositionOfPane'

export default function(paneElement) {
  if (!paneElement) {
    return
  }

  if (paneElement.children.length) {
    // Arrage the position of TypePane, because number of entities decrease.
    arrangePositionOfPane(paneElement)
  } else {
    // Get the ancestor elements before removing.
    const typeDom = getTypeDomOfEntityDom(paneElement)
    const gridDom = typeDom.closest('.textae-editor__grid')

    // Remove type unlese entity.
    typeDom.remove()

    // Remove grid unless type.
    if (!gridDom.children.length) {
      gridDom.remove()
    }
  }
}
