import TypeDefinitionChangeCommand from '../TypeDefinitionChangeCommand'
import TypeDefinitionCreateCommand from '../TypeDefinitionCreateCommand'

export default function(
  typeDefinition,
  id,
  editor,
  annotationData,
  modelType,
  changedProperties
) {
  // The palette also displays instance types other than type in the typeDefinition,
  // so modified type may not be in the typeDefinition.
  if (typeDefinition.has(id)) {
    return new TypeDefinitionChangeCommand(
      editor,
      annotationData,
      typeDefinition,
      modelType,
      id,
      changedProperties,
      null
    )
  } else {
    return new TypeDefinitionCreateCommand(
      editor,
      typeDefinition,
      Object.assign(Object.fromEntries(changedProperties), {
        id
      })
    )
  }
}
