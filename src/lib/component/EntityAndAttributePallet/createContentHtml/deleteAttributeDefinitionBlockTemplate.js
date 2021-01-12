export default function (hasInstance) {
  return `
  <div>
  ${
    hasInstance
      ? 'Attribute definitions with instances cannot be deleted.'
      : '<button type="button" class="textae-editor__type-pallet__table-button textae-editor__type-pallet__delete-predicate"></button>'
  }
  </div>
`
}
