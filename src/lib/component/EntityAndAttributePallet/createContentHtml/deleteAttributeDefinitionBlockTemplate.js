export function deleteAttributeDefinitionBlockTemplate(hasInstance) {
  return `
  <div>
  ${
    hasInstance
      ? 'Attribute definitions with instances cannot be deleted.'
      : '<button type="button" class="textae-editor__type-pallet__delete-predicate">delete attribute</button>'
  }
  </div>
`
}
