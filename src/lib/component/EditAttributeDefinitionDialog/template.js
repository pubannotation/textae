import inputAttributeDefinition from '../inputAttributeDefinition'

export default function (componentClassName, context) {
  return `
<div class="${componentClassName}__container">
  ${inputAttributeDefinition(componentClassName, context)}
</div>`
}
