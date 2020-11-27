import TypeDefinitionDialog from './TypeDefinitionDialog'

export default class CreateTypeDefinitionDialog extends TypeDefinitionDialog {
  constructor(typeContainer, autocompletionWs) {
    const convertToReseltsFunc = (newId, newLabel, newColor, newDefault) => {
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

      return { newType }
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
      convertToReseltsFunc
    )
  }
}
