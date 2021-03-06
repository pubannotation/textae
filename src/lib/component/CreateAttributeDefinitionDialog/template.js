import inputAttributeDefinition from '../inputAttributeDefinition'

export default function (componentClassName, context) {
  const { valueType } = context

  return `
<div class="${componentClassName}__container">
  <div class="${componentClassName}__row">
    <label>Attribute type:</label>
    <select class="${componentClassName}__value-type">
      <option value="flag"${valueType === 'flag' ? ` selected` : ``}>
        flag
        </option>
      <option value="selection"${valueType === 'selection' ? ` selected` : ``}>
        selection
      </option>
      <option value="string"${valueType === 'string' ? ` selected` : ``}>
        string
      </option>
      <option value="numeric"${valueType === 'numeric' ? ` selected` : ``}>
        numeric
      </option>
    </select>
  </div>
  ${inputAttributeDefinition(componentClassName, context)}
</div>`
}
