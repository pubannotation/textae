import getEntityDom from '../../../getEntityDom'

export default function(editor, modification, entity) {
  const entityDom = getEntityDom(editor[0], entity.id)

  if (entityDom) {
    modification.update(entityDom, entity.id)
  }
}
