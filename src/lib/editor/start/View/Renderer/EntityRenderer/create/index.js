import createEntity from './createEntity'

export default function(
  editor,
  namespace,
  typeContainer,
  gridRenderer,
  modification,
  entity
) {
  if (!typeContainer.isBlock(entity.type.name)) {
    createEntity(
      editor,
      namespace,
      typeContainer,
      gridRenderer,
      modification,
      entity
    )
  }
}
