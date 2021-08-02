export default function (content) {
  const typeName = content.querySelector(
    '.textae-editor__edit-type-dialog__type__value__value'
  ).value

  const label = content.querySelector(
    '.textae-editor__edit-type-dialog__type__label__value'
  ).innerText

  const attributes = []
  for (const attr of content.querySelectorAll(
    '.textae-editor__edit-type-dialog__attribute'
  )) {
    attributes.push({
      pred: attr.querySelector(
        '.textae-editor__edit-type-dialog__attribute__predicate__value'
      ).dataset.pred,
      obj: attr.querySelector(
        '.textae-editor__edit-type-dialog__attribute__value__value'
      ).dataset.obj,
      label: attr.querySelector(
        '.textae-editor__edit-type-dialog__attribute__value__value'
      ).dataset.label
    })
  }

  return { typeName, label, attributes }
}
