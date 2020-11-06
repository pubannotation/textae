import dohtml from 'dohtml'
import createEntityHtml from './createEntityHtml'
import EntityHtmlelementSelector from '../../EntityHtmlelementSelector'

export default function (
  editor,
  selectionModel,
  namespace,
  typeContainer,
  entity
) {
  const entityElement = entity.element

  const html = createEntityHtml(entity, namespace, typeContainer)
  const element = dohtml.create(html)

  entityElement.innerHTML = element.innerHTML

  // Re-select a new entity instance.
  if (selectionModel.entity.has(entity.id)) {
    const selector = new EntityHtmlelementSelector(editor)
    selector.select(entity.id)
  }
}
