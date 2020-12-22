import Handlebars from 'handlebars'
import getSelectedEntityLabel from './getSelectedEntityLabel'
import getAttributes from './getAttributes'

const headerSource = `
<div style="display: flex;">
  <p class="textae-editor__type-pallet__title">
    <span>Entity configuration</span>
    <span class="textae-editor__type-pallet__lock-icon" style="display: {{#if isLock}}inline-block{{else}}none{{/if}};">locked</span>
    <br>
    <span class="textae-editor__type-pallet__selected-entity-label">{{selectedEntityLabel}}</span>
  </p>
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
      {{#if shortcutKey}}{{shortcutKey}}:{{/if}}{{pred}}
    </p>
  {{/each}}
  {{#unless isLock}}
  {{#if addAttribute}}
    {{#unless lastAttributeSelected}}<span class="textae-editor__type-pallet__drop-target" data-index="-1"></span>{{/unless}}
    <p class="textae-editor__type-pallet__attribute textae-editor__type-pallet__create-predicate">
      <span class="textae-editor__type-pallet__create-predicate__button" title="Add new attribute"></span>
    </p>
  {{/if}}
  {{/unless}}
  <div class="textae-editor__type-pallet__buttons">
    {{#unless isLock}}
    {{#if addTypeButton}}
      <span class="textae-editor__type-pallet__button textae-editor__type-pallet__add-button" title="Add new type"></span>
    {{/if}}
    {{#if addAttributeValueButton}}
      <span class="textae-editor__type-pallet__button textae-editor__type-pallet__add-attribute-value-button" title="Add new value"></span>
    {{/if}}
    {{/unless}}
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__read-button" title="Import"></span>
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__write-button {{#if hasDiff}}textae-editor__type-pallet__write-button--transit{{/if}}" title="Upload"></span>
  </div>
</div>
`

Handlebars.registerPartial('header', headerSource)

Handlebars.registerPartial(
  'predicate',
  `
  <div class="textae-editor__type-pallet__predicate">
    {{> @partial-block }}
    <div>
    {{#if hasInstance}}
      Attribute definitions with instances cannot be deleted.
    {{else}}
      <button type="button" class="textae-editor__type-pallet__delete-predicate">delete attribute</button>
    {{/if}}
    </div>
  </div>
  `
)

const typeHtml = `
{{>header}}
<table>
  <tbody>
    <tr>
      <th>id</th>
      <th>label</th>
      <th title="Number of annotations.">#</th>
      <th></th>
    </tr>
    {{#if types}}
    {{#each types}}
    <tr class="textae-editor__type-pallet__row" style="background-color: {{color}};">
      <td class="textae-editor__type-pallet__label" data-id="{{id}}">
        <span title={{id}}>
          {{id}}
        </span>
        {{#if uri}}
          <a href="{{uri}}" target="_blank"><span class="textae-editor__type-pallet__link"></span></a>
        {{/if}}
        {{#if defaultType}}
          <span class="textae-editor__type-pallet__default-icon" title="This type is set as a default type."></span>
        {{/if}}
      </td>
      <td class="textae-editor__type-pallet__short-label">
        {{label}}
      </td>
      <td class="textae-editor__type-pallet__use-number">
        {{#if useNumber}}{{useNumber}}{{/if}}
        {{#unless useNumber}}0{{/unless}}
      </td>
      <td class="textae-editor__type-pallet__table-buttons">
        <button
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__select-all {{#unless useNumber}}textae-editor__type-pallet__table-button--disabled{{/unless}}"
          title="Select all the cases of this type."
          data-id="{{id}}"
          data-use-number="{{useNumber}}">
        </button>
        {{#unless ../isLock}}
        <button
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-type"
          title="Edit this type." data-id="{{id}}"
          data-color="{{color}}"
          data-is-default="{{defaultType}}">
        </button>
        <button 
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__remove {{#if useNumber}}textae-editor__type-pallet__table-button--disabled{{/if}}"
          title="{{#if useNumber}}To activate this button, remove all the annotations of this type.{{/if}}{{#unless useNumber}}Remove this type.{{/unless}}"
          data-id="{{id}}"
          data-label="{{label}}">
        </button>
        {{/unless}}
      </td>
    </tr>
    {{/each}}
    {{else}}
    <tr class="textae-editor__type-pallet__row">
      <td class="textae-editor__type-pallet__no-config" colspan="4">There is no Entity definition.</td>
    </tr>
    {{/if}}
  </tbody>
</table>
`

const addAttributeButtonSource = `
{{#unless @root.isEntityWithSamePredSelected}}
<button
  type="button"
  class="textae-editor__type-pallet__add-attribute"
>Add to selected entity</button>
{{/unless}}
`

Handlebars.registerPartial('add-attribute-button', addAttributeButtonSource)

Handlebars.registerPartial(
  'remove-attribute-button',
  `
  {{#if @root.isEntityWithSamePredSelected}}
  <button
    type="button"
    class="textae-editor__type-pallet__remove-attribute"
  >Remove from selected entity</button>
  {{/if}}
`
)

const flagAttributeHtml = `
{{>header}}
<div>
  {{# attrDef}}
    {{#>predicate}}
      <div>
        flag attribute: {{pred}}
        <button
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-predicate"
          title="Edit this predicate.">
        </button>
        {{> add-attribute-button}}
        {{> remove-attribute-button}}
      </div>
    {{/predicate}}
  {{/ attrDef}}
</div>
`

Handlebars.registerPartial(
  'edit-object-button',
  `
  {{#if @root.isEntityWithSamePredSelected}}
  <button
    type="button"
    class="textae-editor__type-pallet__edit-object"
  >Edit object of selected entity</button>
  {{/if}}
`
)

Handlebars.registerPartial(
  'valueButton',
  `
  {{#unless @root.isLock}}
  <td class="textae-editor__type-pallet__table-attribute-buttons">
    <button
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-value"
      title="Edit this value." data-index="{{@index}}">
    </button>
    <button 
      type="button"
      class="textae-editor__type-pallet__table-button textae-editor__type-pallet__remove-value {{#if indelible}}textae-editor__type-pallet__table-button--disabled{{/if}}"
      title="{{#if indelible}}To activate this button, remove all the annotations of this type.{{/if}}{{#unless indelible}}Remove this value.{{/unless}}"
      {{#if indelible}}disabled="disabled"{{/if}}
      data-index="{{@index}}">
    </button>
  </td>
  {{/unless}}
`
)

const numericAttributeHtml = `
{{>header}}
<div>
  {{# attrDef}}
    {{#>predicate}}
      <div>
        <div>
          numeric attribute: {{pred}}
          <button
            type="button"
            class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-predicate"
            title="Edit this predicate.">
          </button>
          {{> add-attribute-button}}
          {{> edit-object-button}}
          {{> remove-attribute-button}}
        </div>
        min: {{min}}
        max: {{max}}
        step: {{step}}
        default: {{default}}
      </div>
    {{/predicate}}
    <table>
      <tbody>
        <tr>
          <th>range</th>
          <th>label</th>
          <th>color</th>
          {{#unless @root.isLock}}
          <th></th>
          {{/unless}}
        </tr>
        {{#each values}}
        <tr class="textae-editor__type-pallet__row" style="background-color: {{color}};">
          <td class="textae-editor__type-pallet__attribute-label">
            {{range}}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            {{label}}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            {{color}}
          </td>
          {{>valueButton}}
        </tr>
        {{/each}}
      </tbody>
    </table>
  {{/ attrDef}}
</div>
`

const selectionAttributeHtml = `
{{>header}}
<div>
  {{# attrDef}}
    {{#>predicate}}
      <div>
        selection attribute: {{pred}}
        <button
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-predicate"
          title="Edit this predicate.">
        </button>
        {{> add-attribute-button}}
        {{> remove-attribute-button}}
      </div>
    {{/predicate}}
    </div>
    <table>
      <tbody>
        <tr>
          <th>id</th>
          <th>label</th>
          <th>color</th>
          {{#unless @root.isLock}}
          <th></th>
          {{/unless}}
        </tr>
        {{#each values}}
        <tr class="textae-editor__type-pallet__row" style="background-color: {{color}};">
          <td class="textae-editor__type-pallet__selection-attribute-label" data-id="{{id}}">
            {{id}}
            {{#if default}}
              <span class="textae-editor__type-pallet__default-icon" title="This type is set as a default type."></span>
            {{/if}}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            {{label}}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            {{color}}
          </td>
          {{>valueButton}}
        </tr>
        {{/each}}
      </tbody>
    </table>
  {{/ attrDef}}
</div>
`

const stringAttributeHtml = `
{{>header}}
<div>
  {{# attrDef}}
    {{#>predicate}}
      <div>
        <div>
          string attribute: {{pred}}
          <button
            type="button"
            class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-predicate"
            title="Edit this predicate.">
          </button>
          {{> add-attribute-button}}
          {{> edit-object-button}}
          {{> remove-attribute-button}}
        </div>
        default: {{default}}
      </div>
    {{/predicate}}
    <table>
      <tbody>
        <tr>
          <th>pattern</th>
          <th>label</th>
          <th>color</th>
          {{#unless @root.isLock}}
          <th></th>
          {{/unless}}
        </tr>
        {{#each values}}
        <tr class="textae-editor__type-pallet__row" style="background-color: {{color}};">
          <td class="textae-editor__type-pallet__attribute-label">
            {{pattern}}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            {{label}}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            {{color}}
          </td>
          {{>valueButton}}
        </tr>
        {{/each}}
      </tbody>
    </table>
  {{/ attrDef}}
</div>
`

const typeTemplate = Handlebars.compile(typeHtml)
const flagAttributeTemplate = Handlebars.compile(flagAttributeHtml)
const numericAttributeTemplate = Handlebars.compile(numericAttributeHtml)
const selectionAttributeTemplate = Handlebars.compile(selectionAttributeHtml)
const stringAttributeTemplate = Handlebars.compile(stringAttributeHtml)

export default function (
  typeContainer,
  hasDiff,
  selectedPred,
  selectionModelEntity
) {
  const addAttribute = typeContainer.attributes.length < 30
  const attributes = getAttributes(typeContainer, selectedPred)

  if (selectedPred) {
    const attrDef = typeContainer.attributes.find(
      (a) => a.pred === selectedPred
    )

    const values = {
      isLock: typeContainer.isLock,
      attributes,
      hasDiff,
      attrDef: Object.assign(attrDef.JSON, {
        hasInstance: typeContainer.hasAttributeInstance(selectedPred)
      }),
      selectedPred,
      lastAttributeSelected:
        typeContainer.attributes.indexOf(attrDef) ===
        typeContainer.attributes.length - 1,
      addAttribute,
      selectedEntityLabel: getSelectedEntityLabel(selectionModelEntity.size),
      isEntityWithSamePredSelected: selectionModelEntity.isSamePredAttrributeSelected(
        selectedPred
      )
    }

    switch (attrDef.valueType) {
      case 'flag':
        return flagAttributeTemplate(values)
      case 'numeric':
        return numericAttributeTemplate(
          Object.assign(values, {
            addAttributeValueButton: true
          })
        )
      case 'selection':
        // Disable to press the remove button for the value used in the selection attribute.
        for (const value of values.attrDef.values) {
          value.indelible = typeContainer.isSelectionAttributeIndelible(
            selectedPred,
            value.id
          )
        }

        return selectionAttributeTemplate(
          Object.assign(values, {
            addAttributeValueButton: true
          })
        )
      case 'string':
        return stringAttributeTemplate(
          Object.assign(values, {
            addAttributeValueButton: true
          })
        )
      default:
        throw `attrDef.valueType is unknown attribute`
    }
  }

  return typeTemplate({
    isLock: typeContainer.isLock,
    attributes,
    hasDiff,
    types: typeContainer.pallet,
    addAttribute,
    addTypeButton: true,
    selectedEntityLabel: getSelectedEntityLabel(selectionModelEntity.size)
  })
}
