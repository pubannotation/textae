import dohtml from 'dohtml'
import getTypeDom from '../getTypeDom'
import createEntityHtml from './createEntityHtml'
import EntityDomSelector from '../../EntityDomSelector'

export default function(
  editor,
  selectionModel,
  namespace,
  typeContainer,
  entity
) {
  const typeDom = getTypeDom(entity)

  const html = createEntityHtml(entity, namespace, typeContainer)
  const element = dohtml.create(html)

  typeDom.innerHTML = element.innerHTML

  // Re-select a new entity instance.
  if (selectionModel.entity.has(entity.id)) {
    const selector = new EntityDomSelector(editor)
    selector.select(entity.id)
    selector.updateLabel(entity.id)
  }
}
