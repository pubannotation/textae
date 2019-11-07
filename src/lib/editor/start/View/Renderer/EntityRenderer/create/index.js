import createEntity from './createEntity'

export default function(
  editor,
  typeContainer,
  gridRenderer,
  modification,
  entity,
  annotationData
) {
  if (!annotationData.entity.isBlock(entity.type.name)) {
    createEntity(
      editor,
      annotationData.namespace,
      typeContainer,
      gridRenderer,
      modification,
      entity
    )
  }
}
