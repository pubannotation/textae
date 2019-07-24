import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

class TypeChangeCommand extends BaseCommand {
  constructor(
    editor,
    annotationData,
    typeDefinition,
    modelType,
    oldType,
    changeValues,
    revertDefaultTypeId
  ) {
    super(function() {
      const newType = Object.assign({}, oldType)
      const revertChangeValues = {}

      // change config
      Object.keys(changeValues).forEach((key) => {
        if (changeValues[key] === null && typeof oldType[key] !== 'undefined') {
          delete newType[key]
          revertChangeValues[key] = oldType[key]
        } else if (changeValues[key] !== null) {
          newType[key] = changeValues[key]
          revertChangeValues[key] =
            typeof oldType[key] === 'undefined' ? null : oldType[key]
        }
      })
      typeDefinition.changeDefinedType(oldType.id, newType)

      // manage default type
      if (newType.default) {
        // remember the current default, because revert command will not understand what type was it.
        revertDefaultTypeId = typeDefinition.getDefaultType()
        typeDefinition.setDefaultType(newType.id)
      } else if (revertDefaultTypeId) {
        typeDefinition.setDefaultType(revertDefaultTypeId)
        revertDefaultTypeId = 'undefined'
      }

      // change annotation
      annotationData[modelType].all().map((model) => {
        if (model.type === oldType.label || model.type === oldType.id) {
          annotationData[modelType].changeType(model.id, newType.id)
        }
      })

      // Set revert
      this.revert = () =>
        new TypeChangeCommand(
          editor,
          annotationData,
          typeDefinition,
          modelType,
          newType,
          revertChangeValues,
          revertDefaultTypeId
        )

      commandLog(
        'change old type:' +
          JSON.stringify(oldType) +
          ' to new type:' +
          JSON.stringify(newType) +
          ', default is `' +
          typeDefinition.getDefaultType() +
          '`'
      )
    })
  }
}

export default TypeChangeCommand
