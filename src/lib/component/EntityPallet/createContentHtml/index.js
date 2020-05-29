import Handlebars from 'handlebars'

const typeHtml = `
<div style="display: flex;">
<p class="textae-editor__type-pallet__attribute {{#unless selectedPred}}textae-editor__type-pallet__attribute--selected{{/unless}}" data-attribute="">
  Type
</p>
{{#each attributes}}
  {{#if droppable}}
  <span class="textae-editor__type-pallet__drop-target" data-index="{{@index}}"></span>
  {{/if}}
  <p 
    class="textae-editor__type-pallet__attribute{{#if selectedPred}} textae-editor__type-pallet__attribute--selected{{/if}}"
    data-attribute="{{pred}}"
    data-index="{{@index}}"
    {{#if selectedPred}}draggable="true"{{/if}}>
    {{pred}}
  </p>
{{/each}}
</div>
`
const typeTemplate = Handlebars.compile(typeHtml)

export default function(typeContainer, selectedPred) {
  const attributes2 = typeContainer.attributes

  if (selectedPred) {
    const attributes = []
    // Moving an attribute to before or after the current position does not change the position.
    let isPrevSelected
    for (const a of attributes2) {
      attributes.push({
        pred: a.pred,
        selectedPred: selectedPred === a.pred,
        droppable: selectedPred !== a.pred && !isPrevSelected
      })
      isPrevSelected = selectedPred === a.pred
    }

    const attrDef = attributes2.find((a) => a.pred === selectedPred)

    const values = {
      attributes,
      attrDef: Object.assign(attrDef.JSON, {
        hasInstance: false
      }),
      selectedPred,
      lastAttributeSelected:
        attributes2.indexOf(attrDef) === attributes2.length - 1,
      selectedEntityLabel: '',
      isEntityWithSamePredSelected: false
    }

    switch (attrDef.valueType) {
      case 'flag':
        return typeTemplate(values)
      case 'numeric':
        return typeTemplate(
          Object.assign(values, {
            addAttributeValueButton: true
          })
        )
      case 'selection':
        // Disable to press the remove button for the value used in the selection attribute.
        for (const value of values.attrDef.values) {
          value.useNumber = 0
        }

        return typeTemplate(
          Object.assign(values, {
            addAttributeValueButton: true
          })
        )
      case 'string':
        return typeTemplate(
          Object.assign(values, {
            addAttributeValueButton: true
          })
        )
      default:
        throw `attrDef.valueType is unknown attribute`
    }
  }

  return typeTemplate({
    attributes: attributes2,
    addTypeButton: true,
    selectedEntityLabel: ''
  })
}
