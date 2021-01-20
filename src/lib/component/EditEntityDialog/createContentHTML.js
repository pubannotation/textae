import toEntityHTML from './toEntityHTML'
import toAttributeHTML from './toAttributeHTML'

export default function (typeValues, entityContainer, attributeContainer) {
  const { typeName, attributes } = typeValues
  const contentHtml = `
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
            .map((a) => toAttributeHTML(a, attributeContainer))
            .join('')}
          </tbody>
      </table>
      `
  return contentHtml
}
