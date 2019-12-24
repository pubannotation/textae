import TypeDefinitionDialog from './TypeDefinitionDialog'

export default class extends TypeDefinitionDialog {
  constructor(editor, typeContainer, autocompletionWs) {
    const onOkHandler = (newId, newLabel, newColor, newDefault) => {
      if (newId === '') {
        return
      }

      const newType = {
        id: newId,
        color: newColor
      }

      if (newLabel !== '') {
        newType.label = newLabel
      }

      if (newDefault) {
        newType.default = newDefault
      }

      editor.eventEmitter.emit(
        'textae.createTypeDefinitionDialog.done',
        newType
      )
    }

    super(
      'Please create a new type',
      {
        id: null,
        label: '',
        color: typeContainer.defaultColor,
        isDefault: false
      },
      typeContainer,
      autocompletionWs,
      onOkHandler
    )
  }
}
