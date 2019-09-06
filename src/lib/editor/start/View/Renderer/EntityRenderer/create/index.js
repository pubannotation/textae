import createEntity from './createEntity'

export default function(
  editor,
  namespace,
  typeDefinition,
  gridRenderer,
  modification,
  entity
) {
  if (!typeDefinition.isBlock(entity.type.name)) {
    createEntity(
      editor,
      namespace,
      typeDefinition,
      gridRenderer,
      modification,
      entity
    )
  }
}
