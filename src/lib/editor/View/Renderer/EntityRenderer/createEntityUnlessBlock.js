import create from './create'

export default function(editor, namespace, typeContainer, gridRenderer, modification, entity) {
  if (!typeContainer.entity.isBlock(entity.type)) {
    create(editor, namespace, typeContainer, gridRenderer, modification, entity)
  }
}
