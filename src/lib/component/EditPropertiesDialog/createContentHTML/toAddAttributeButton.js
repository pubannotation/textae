import anemone from './anemone'

export default function toAddAttributeButton(valueType, pred, isDisabled) {
  const title = isDisabled
    ? `disabled="disabled" title="This predicate is already used with its default value."`
    : anemone`title="${valueType} type"`

  return anemone`
    <button
     type="button"
     class="textae-editor__edit-type-values-dialog__add-attribute textae-editor__edit-type-values-dialog__add-attribute--${valueType}"
     data-pred="${pred}"
      ${() => title}> ${pred}</button>`
}
