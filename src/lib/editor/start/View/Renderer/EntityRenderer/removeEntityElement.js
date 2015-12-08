import getEntityDom from '../../../getEntityDom'

export default function(editor, entityId) {
  const entityDom = getEntityDom(editor[0], entityId)

  // The entity may be removed already.
  if (entityDom) {
    const paneNode = entityDom.parentNode

    entityDom.remove()
    return paneNode
  }

  return null
}
