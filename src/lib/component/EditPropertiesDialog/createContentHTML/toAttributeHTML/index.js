import anemone from '../../../anemone'
import getLabelOf from './getLabelOf'

export default function (
  attribute,
  index,
  attributeInstances,
  attributeContainer
) {
  const { id, subj, pred, obj } = attribute
  const previousAttribute = attributeInstances[index - 1]
  const previousPredicate = previousAttribute && previousAttribute.pred
  const definitionIndex = attributeContainer.getIndexOf(pred)
  const { valueType } = attributeContainer.get(pred)

  const shortcutKeyColumn = () =>
    pred === previousPredicate
      ? `<td class="shortcut-key" rowspan="2"></td>`
      : `<td class="shortcut-key" rowspan="2">
          ${
            definitionIndex < 9
              ? `<span class="textae-editor__edit-type-values-dialog__shortcut-key" title="Shortcut key for this predicate">${
                  definitionIndex + 1
                }</span>`
              : ''
          }
        </td>
        `

  return () => anemone`
<tr class="textae-editor__edit-type-values-dialog__attribute">
  ${shortcutKeyColumn}
  <td rowspan="2">
    <span
      class="textae-editor__edit-type-values-dialog__attribute-predicate ${
        pred === previousPredicate
          ? ''
          : `textae-editor__edit-type-values-dialog__attribute-predicate--${valueType}`
      }"
      data-pred="${pred}"
      title="${valueType} type"
      >
      ${pred === previousPredicate ? '' : pred}
    </span>
  </td>
  <td>
    <span
      class="textae-editor__edit-type-values-dialog__attribute-value"
      data-id="${id}"
      data-subj="${subj || ''}""
      data-obj="${obj}"
      data-label="${getLabelOf(attribute, attributeContainer)}"
      >
      ${getLabelOf(attribute, attributeContainer) || obj}
    </span>
  </td>
</tr>
<tr>
  <td>
    <button
      type="button"
      class="textae-editor__edit-type-values-dialog__edit-attribute"
      data-pred="${pred}"
      data-index="${index}"
      ${valueType === 'flag' ? 'disabled="disabled"' : ''}>
    </button>
    <button
      type="button"
      class="textae-editor__edit-type-values-dialog__remove-attribute"
      data-index="${index}">
    </button>
  </td>
</tr>
`
}
