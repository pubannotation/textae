import createEntity from './createEntity'

export default function(
  editor,
  typeContainer,
  gridRenderer,
  modification,
  entity,
  namespace
) {
  if (!entity.type.isBlock) {
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
