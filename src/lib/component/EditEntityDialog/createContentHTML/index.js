import toEntityHTML from './toEntityHTML'
import toAttributeHTML from './toAttributeHTML'

export default function (
  typeName,
  attributes,
  entityContainer,
  attributeContainer
) {
  return `
    <div style="overflow-y: auto; max-height: 25em; overflow-x: hidden;">
      <table class="textae-editor__edit-type-dialog__table">
        <thead>
          <tr>
            <th></th>
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
    </div>
    <fieldset>
      <legend>Available Predicates:</legend>
      <div class="textae-editor__edit-type-dialog__add-attribute-buttons">
      ${attributeContainer.attributes
        .map(
          ({ pred, valueType }) =>
            `<button
              type="button" 
              class="ui-button ui-corner-all textae-editor__edit-type-dialog__attribute__add textae-editor__edit-type-dialog__attribute__add--${valueType}"
              ${
                attributes.some(
                  (i) =>
                    i.pred === pred &&
                    String(i.obj) ===
                      String(attributeContainer.get(pred).default)
                )
                  ? `disabled="disabled" title="There is an attribute with a default value."`
                  : ''
              }>${pred}</button>`
        )
        .join(' ')}
      </div>
    </fieldset>
  `
}
