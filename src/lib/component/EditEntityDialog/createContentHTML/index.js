import toEntityHTML from './toEntityHTML'
import toAttributeHTML from './toAttributeHTML'

export default function (typeValues, entityContainer, attributeContainer) {
  const { typeName, attributes } = typeValues

  return `
    <table class="textae-editor__edit-type-dialog__table">
      <thead>
        <tr>
          <th>Predicate</th>
          <th>Value</th>
          <th>Label</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        ${toEntityHTML(typeName, entityContainer)}
        ${attributes
          .map((a, index, list) =>
            toAttributeHTML(a, index, list, attributeContainer)
          )
          .join('')}
        </tbody>
    </table>
    ${attributeContainer.attributes
      .map(
        ({ pred }) =>
          `<button type="button" class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__add">${pred}</button>`
      )
      .join(' ')}
  `
}
