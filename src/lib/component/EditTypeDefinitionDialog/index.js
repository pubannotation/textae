import TypeDefinitionDialog from '../TypeDefinitionDialog'
import getDifference from './getDifference'

export default class EditTypeDefinitionDialog extends TypeDefinitionDialog {
  constructor(definitionContainer, id, color, isDefault, autocompletionWs) {
    const label = definitionContainer.getLabel(id) || ''

    const beforeChange = {
      id,
      label,
      color,
      isDefault
    }

    const convertToReseltsFunc = (newId, newLabel, newColor, newDefault) => {
      const afterChange = {
        id: newId,
        label: newLabel,
        color: newColor,
        isDefault: newDefault
      }

      const changedProperties = getDifference(beforeChange, afterChange)

      return {
        id,
        changedProperties
      }
    }

    super(
      'Please edit the type',
      beforeChange,
      definitionContainer,
      autocompletionWs,
      convertToReseltsFunc
    )
  }
}
