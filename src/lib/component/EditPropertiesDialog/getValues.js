export default function (content) {
  const typeName = content.querySelector(
    '.textae-editor__edit-type-values-dialog__type-name'
  ).value

  const label = content.querySelector(
    '.textae-editor__edit-type-values-dialog__type-label'
  ).innerText

  const attributes = []
  for (const attr of content.querySelectorAll(
    '.textae-editor__edit-type-values-dialog__attribute'
  )) {
    attributes.push({
      id: attr.querySelector(
        '.textae-editor__edit-type-values-dialog__attribute-value'
      ).dataset.id,
      subj: attr.querySelector(
        '.textae-editor__edit-type-values-dialog__attribute-value'
      ).dataset.subj,
      pred: attr.querySelector(
        '.textae-editor__edit-type-values-dialog__attribute-predicate'
      ).dataset.pred,
      obj: attr.querySelector(
        '.textae-editor__edit-type-values-dialog__attribute-value'
      ).dataset.obj,
      label: attr.querySelector(
        '.textae-editor__edit-type-values-dialog__attribute-value'
      ).dataset.label
    })
  }

  return { typeName, label, attributes }
}
