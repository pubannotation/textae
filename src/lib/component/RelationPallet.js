import { diff } from 'jsondiffpatch'
import Pallet from './Pallet'
import createPalletElement from './Pallet/createPalletElement'
import compileHandlebarsTemplate from '../compileHandlebarsTemplate'

const template = compileHandlebarsTemplate(`
<p class="textae-editor__type-pallet__title">
  <span>Relation configuration</span>
  <span class="textae-editor__type-pallet__lock-icon" style="display: {{#if isLock}}inline-block{{else}}none{{/if}};">locked</span>
</p>
<div class="textae-editor__type-pallet__buttons">
  {{#unless isLock}}
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__add-button" title="Add new type"></span>
  {{/unless}}
  <span class="textae-editor__type-pallet__button textae-editor__type-pallet__read-button" title="Import"></span>
  <span class="textae-editor__type-pallet__button textae-editor__type-pallet__write-button {{#if hasDiff}}textae-editor__type-pallet__write-button--transit{{/if}}" title="Upload"></span>
</div>
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
      <td class="textae-editor__type-pallet__no-config" colspan="4">There is no Relation definition.</td>
    </tr>
    {{/if}}
  </tbody>
</table>
`)

export default class RelationPallet extends Pallet {
  constructor(editor, originalData, typeDefinition) {
    super(editor, createPalletElement('relation'))

    this._originalData = originalData
    this._typeDefinition = typeDefinition
    this._typeContainer = typeDefinition.relation
  }

  get _content() {
    const hasDiff = diff(
      this._originalData.configuration,
      Object.assign(
        {},
        this._originalData.configuration,
        this._typeDefinition.config
      )
    )

    return template({
      isLock: this._typeContainer.isLock,
      hasDiff,
      types: this._typeContainer.pallet
    })
  }
}
