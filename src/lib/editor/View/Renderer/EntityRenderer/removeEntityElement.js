import getEntityDom from '../../../getEntityDom'
import arrangePositionOfPane from './arrangePositionOfPane'

export default function(editor, annotationData, entity) {
  let entityDom = getEntityDom(editor[0], entity.id)

  // The entity is removed already.
  if (!entityDom) {
    return
  }

  let paneDom = entityDom.parentNode
  entityDom.remove()

  if (paneDom.children.length) {
    // Arrage the position of TypePane, because number of entities decrease.
    arrangePositionOfPane(paneDom)
  } else {
    let typeDom = paneDom.parentNode,
      gridDom = typeDom.parentNode

    // Remove type unlese entity.
    typeDom.remove()

    // Remove grid unless type.
    if (!gridDom.children.length) {
      gridDom.remove()
    }
  }
}
