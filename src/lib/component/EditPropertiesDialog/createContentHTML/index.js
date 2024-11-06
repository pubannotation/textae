import toEntityHTML from './toEntityHTML'
import toAttributeHTML from './toAttributeHTML'
import anemone from '../../anemone'
import toAddAttributeButton from './toAddAttributeButton'

export default function (
  typeName,
  typeLabel,
  attributes,
  entityContainer,
  attributeContainer,
  palletName
) {
  return anemone`
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
          ${toEntityHTML(typeName, typeLabel, entityContainer)}
          ${attributes.map((a, index, list) =>
            toAttributeHTML(a, index, list, attributeContainer)
          )}
          </tbody>
      </table>
    </div>
    <fieldset>
      <legend>
        <span class="textae-editor__edit-type-values-dialog__open-pallet" title="${palletName} Configuration"></span>
        Available Predicates:
      </legend>
      <div class="textae-editor__edit-type-values-dialog__add-attribute-buttons">
      ${attributeContainer.attributes.map(({ pred, valueType }) =>
        toAddAttributeButton(
          valueType,
          pred,
          isAlreadyUsed(attributes, pred, attributeContainer)
        )
      )}
      </div>
    </fieldset>
  `
}

function isAlreadyUsed(attributes, pred, attributeContainer) {
  return attributes.some(
    (i) =>
      i.pred === pred &&
      String(i.obj) === String(attributeContainer.get(pred).default)
  )
}
