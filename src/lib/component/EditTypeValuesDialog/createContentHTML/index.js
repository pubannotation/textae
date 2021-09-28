import toEntityHTML from './toEntityHTML'
import toAttributeHTML from './toAttributeHTML'

export default function (
  typeName,
  attributes,
  entityContainer,
  attributeContainer,
  palletName
) {
  return `
    <div style="overflow-y: auto; max-height: 36em; overflow-x: hidden;">
      <table class="textae-editor__edit-type-values-dialog__table">
        <thead>
          <tr>
            <th></th>
            <th>Predicate</th>
            <th>Value/Label</th>
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
      <legend>
        <span class="textae-editor__edit-type-values-dialog__open-pallet" title="${palletName} Configuration"></span>
        Available Predicates:
      </legend>
      <div class="textae-editor__edit-type-values-dialog__add-attribute-buttons">
      ${attributeContainer.attributes
        .map(
          ({ pred, valueType }) =>
            `<button
              type="button" 
              class="textae-editor__edit-type-values-dialog__add-attribute textae-editor__edit-type-values-dialog__add-attribute--${valueType}"
              data-pred="${pred}"
              title="${valueType} type"
              ${
                attributes.some(
                  (i) =>
                    i.pred === pred &&
                    String(i.obj) ===
                      String(attributeContainer.get(pred).default)
                )
                  ? `disabled="disabled" title="This predicate is already used with its default value."`
                  : ''
              }> ${pred}</button>`
        )
        .join(' ')}
      </div>
    </fieldset>
  `
}
