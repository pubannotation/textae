import editAttributeDefinitionBlockTemplate from '../editAttributeDefinitionBlockTemplate'

export default function (context) {
  const { attrDef, selectionModelItems } = context
  const { pred } = attrDef
  const { valueType } = attrDef
  const numberOfSelectedItems = selectionModelItems.size

  return `
  <div class="textae-editor__type-pallet__predicate-controller">
    <div>
      ${editAttributeDefinitionBlockTemplate(context)}
      Attribute
      <span
        class="textae-editor__type-pallet__predicate__value-type textae-editor__type-pallet__predicate__value-type--${valueType}"
        title="${valueType} type">
      </span>
      "${pred}"
    </div>
  </div>
  `
}
