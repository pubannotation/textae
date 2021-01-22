import inputAttributeDefinition from '../inputAttributeDefinition'

export default function (context) {
  const componentClassName = 'textae-editor__edit-attribute-definition-dialog'

  return `
<div class="${componentClassName}__container">
  ${inputAttributeDefinition(componentClassName, context)}
</div>`
}
