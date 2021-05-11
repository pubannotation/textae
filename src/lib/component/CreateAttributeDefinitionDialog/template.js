import inputAttributeDefinition from '../inputAttributeDefinition'

export default function (componentClassName, context) {
  const { valueType } = context

  return `
<div class="${componentClassName}__container">
  <div class="${componentClassName}__row">
    <label>Attribute type:</label>
    <label>
      <input
        type="radio" 
        name="${componentClassName}__value-type"
        value="flag"
        ${valueType === 'flag' ? `checked` : ``}
        >
      flag
    </label>
    <label>
      <input
        type="radio"
        name="${componentClassName}__value-type"
        value="selection"
        ${valueType === 'selection' ? `checked` : ``}
        >
      selection
    </label>
    <label>
      <input
        type="radio"
        name="${componentClassName}__value-type"
        value="string"
        ${valueType === 'string' ? `checked` : ``}
        >
      string
    </label>
    <label>
      <input
        type="radio"
        name="${componentClassName}__value-type"
        value="numeric"
        ${valueType === 'numeric' ? `checked` : ``}
        >
      numeric
    </label>
  </div>
  ${inputAttributeDefinition(componentClassName, context)}
</div>`
}
