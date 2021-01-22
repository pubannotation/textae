import inputAttributeDefinition from '../inputAttributeDefinition'

export default function (context) {
  const {
    flagSelected,
    selectionSelected,
    stringSelected,
    numericSelected
  } = context
  const componentClassName = 'textae-editor__create-attribute-definition-dialog'

  return `
<div class="${componentClassName}__container">
  <div class="${componentClassName}__row">
    <label>Attribute type:</label>
    <select class="${componentClassName}__value-type">
      <option value="flag"${flagSelected ? ` selected` : ``}>
        flag
        </option>
      <option value="selection"${selectionSelected ? ` selected` : ``}>
        selection
      </option>
      <option value="string"${stringSelected ? ` selected` : ``}>
        string
      </option>
      <option value="numeric"${numericSelected ? ` selected` : ``}>
        numeric
      </option>
    </select>
  </div>
  ${inputAttributeDefinition(componentClassName, context)}
</div>`
}
