import ChangeTypeDefinitionCommand from '../ChangeTypeDefinitionCommand'
import CreateTypeDefinitionCommand from '../CreateTypeDefinitionCommand'

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
    return new ChangeTypeDefinitionCommand(
      editor,
      annotationData,
      typeDefinition,
      modelType,
      id,
      changedProperties,
      null
    )
  } else {
    return new CreateTypeDefinitionCommand(
      editor,
      typeDefinition,
      Object.fromEntries(changedProperties)
    )
  }
}
