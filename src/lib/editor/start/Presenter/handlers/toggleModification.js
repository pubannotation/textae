import _ from 'underscore'

var isModificationType = function(modification, modificationType) {
    return modification.pred === modificationType
  },
  getSpecificModification = function(annotationData, id, modificationType) {
    return annotationData
      .getModificationOf(id)
      .filter(function(modification) {
        return isModificationType(modification, modificationType)
      })
  },
  removeModification = function(command, annotationData, modificationType, typeEditor) {
    return typeEditor.getSelectedIdEditable().map(function(id) {
      var modification = getSpecificModification(annotationData, id, modificationType)[0]
      return command.factory.modificationRemoveCommand(modification.id)
    })
  },
  createModification = function(command, annotationData, modificationType, typeEditor) {
    return _.reject(typeEditor.getSelectedIdEditable(), function(id) {
      return getSpecificModification(annotationData, id, modificationType).length > 0
    }).map(function(id) {
      return command.factory.modificationCreateCommand({
        obj: id,
        pred: modificationType
      })
    })
  },
  createCommand = function(command, annotationData, modificationType, typeEditor, has) {
    if (has) {
      return removeModification(command, annotationData, modificationType, typeEditor)
    } else {
      return createModification(command, annotationData, modificationType, typeEditor)
    }
  },
  toggleModification = function(command, annotationData, modeAccordingToButton, modificationType, typeEditor) {
    var has = modeAccordingToButton[modificationType.toLowerCase()].value(),
      commands = createCommand(command, annotationData, modificationType, typeEditor, has)
    command.invoke(commands)
  }

module.exports = toggleModification
