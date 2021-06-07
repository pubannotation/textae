import TypeDefinitionDialog from './TypeDefinitionDialog'

export default class CreateTypeDefinitionDialog extends TypeDefinitionDialog {
  constructor(definitionContainer, autocompletionWs) {
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
      'New type',
      {
        id: null,
        label: '',
        color: definitionContainer.defaultColor,
        isDefault: false
      },
      definitionContainer,
      autocompletionWs,
      convertToReseltsFunc
    )
  }
}
