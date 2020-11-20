import dohtml from 'dohtml'
import createEntityHtml from './createEntityHtml'

export default function (selectionModel, namespace, typeContainer, entity) {
  const entityElement = entity.element

  const html = createEntityHtml(entity, namespace, typeContainer)
  const element = dohtml.create(html)

  entityElement.replaceWith(element)

  // Re-select a new entity instance.
  if (selectionModel.entity.has(entity.id)) {
    entity.select()
  }
}
