import TypeDefinitionDialog from '../TypeDefinitionDialog'
import getDifference from './getDifference'

export default class extends TypeDefinitionDialog {
  constructor(typeContainer, id, color, isDefault, autocompletionWs, done) {
    const label = typeContainer.getLabel(id) || ''

    const beforeChange = {
      id,
      label,
      color,
      isDefault
    }

    const onOkHandler = (newId, newLabel, newColor, newDefault) => {
      const afterChange = {
        id: newId,
        label: newLabel,
        color: newColor,
        isDefault: newDefault
      }

      const changedProperties = getDifference(beforeChange, afterChange)
      done(changedProperties)
    }

    super(
      'Please edit the type',
      beforeChange,
      typeContainer,
      autocompletionWs,
      onOkHandler
    )
  }
}
