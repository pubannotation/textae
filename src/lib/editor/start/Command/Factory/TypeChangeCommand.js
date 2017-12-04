import BaseCommand from './BaseCommand'
import commandLog from './commandLog'

class TypeChangeCommand extends BaseCommand {
  constructor(editor, annotationData, typeContainer, modelType, id, newType, revertDefaultTypeId) {
    super(function() {
      let oldType = typeContainer.getDefinedType(id),
        mergedType = Object.assign({}, oldType)

      // change config
      Object.assign(mergedType, newType)
      Object.keys(mergedType).forEach((key) => {
        if (mergedType[key] === '' || (key === 'default' && !mergedType[key])) {
          delete mergedType[key]
        }
      })
      typeContainer.changeDefinedType(id, mergedType)

      // manage default type
      if (revertDefaultTypeId) {
        typeContainer.setDefaultType(revertDefaultTypeId)
      } else if (newType.default && newType.default !== oldType.default) {
        // remember the current default, because revert command will not understand what type was it.
        revertDefaultTypeId = typeContainer.getDefaultType()
        typeContainer.setDefaultType(mergedType.id)
      }

      // change annotation
      annotationData[modelType].all().map((model) => {
        if (model.type === oldType.label || model.type === oldType.id) {
          annotationData[modelType].changeType(model.id, mergedType.id)
        }
      })

      // Set revert
      this.revert = () => new TypeChangeCommand(editor, annotationData, typeContainer, modelType, mergedType.id, oldType, revertDefaultTypeId)

      editor.eventEmitter.emit('textae.pallet.update')
      commandLog('change old type:' + JSON.stringify(oldType)
        + ' to new type:' + JSON.stringify(mergedType)
        + ', default is `' + typeContainer.getDefaultType() + '`')
    })
  }
}

export default TypeChangeCommand
