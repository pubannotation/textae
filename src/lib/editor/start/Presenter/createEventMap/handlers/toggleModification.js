export default function(command, annotationData, modeAccordingToButton, modificationType, typeEditor) {
  const has = modeAccordingToButton[modificationType.toLowerCase()].value()
  const commands = createCommand(command, annotationData, modificationType, typeEditor, has)

  command.invoke(commands, ['annotation'])
}

function createCommand(command, annotationData, modificationType, typeEditor, has) {
  if (has) {
    return removeModification(command, annotationData, modificationType, typeEditor)
  } else {
    return createModification(command, annotationData, modificationType, typeEditor)
  }
}

function createModification(command, annotationData, modificationType, typeEditor) {
  return typeEditor.getSelectedIdEditable()
    .filter((id) => !getSpecificModification(annotationData, id, modificationType).length > 0)
    .map((id) => command.factory.modificationCreateCommand({
        obj: id,
        pred: modificationType
      })
    )
}

function removeModification(command, annotationData, modificationType, typeEditor) {
  return typeEditor.getSelectedIdEditable().map((id) => {
    const modification = getSpecificModification(annotationData, id, modificationType)[0]
    return command.factory.modificationRemoveCommand(modification.id)
  })
}

function getSpecificModification(annotationData, id, modificationType) {
  return annotationData
    .getModificationOf(id)
    .filter((modification) => isModificationType(modification, modificationType))
}

function isModificationType(modification, modificationType) {
  return modification.pred === modificationType
}


