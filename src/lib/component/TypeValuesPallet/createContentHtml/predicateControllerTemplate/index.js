import editAttributeDefinitionBlockTemplate from './editAttributeDefinitionBlockTemplate'

export default function (context) {
  const { attrDef } = context
  const { pred } = attrDef
  const { valueType } = attrDef

  return `
    <div>
      Attribute
      <span
        class="textae-editor__type-pallet__predicate__value-type textae-editor__type-pallet__predicate__value-type--${valueType}"
        title="${valueType} type">
      </span>
      "${pred}"
      ${editAttributeDefinitionBlockTemplate(context)}
    </div>
  `
}
