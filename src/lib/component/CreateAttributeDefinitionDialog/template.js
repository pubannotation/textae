import inputAttributeDefinition from '../inputAttributeDefinition'

export default function (componentClassName, context) {
  const { valueType } = context

  return `
<div class="${componentClassName}__container">
  <div class="${componentClassName}__row">
    <label>Attribute type</label>
    <div class="${componentClassName}__value-type-row">
      <label>
        <input
          type="radio" 
          name="${componentClassName}__value-type"
          value="flag"
          ${valueType === 'flag' ? `checked` : ``}
          >
        <span class="${componentClassName}__value-type--flag">
        flag
      </label>
      <label>
        <input
          type="radio"
          name="${componentClassName}__value-type"
          value="selection"
          ${valueType === 'selection' ? `checked` : ``}
          >
        <span class="${componentClassName}__value-type--selection">
        selection
      </label>
      <label>
        <input
          type="radio"
          name="${componentClassName}__value-type"
          value="string"
          ${valueType === 'string' ? `checked` : ``}
          >
        <span class="${componentClassName}__value-type--string">
        string
      </label>
      <label>
        <input
          type="radio"
          name="${componentClassName}__value-type"
          value="numeric"
          ${valueType === 'numeric' ? `checked` : ``}
          >
        <span class="${componentClassName}__value-type--numeric">
        numeric
      </label>
    </div>
  </div>
  ${inputAttributeDefinition(componentClassName, context)}
</div>`
}
