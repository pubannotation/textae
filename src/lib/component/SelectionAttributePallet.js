import delegate from 'delegate'
import Pallet from './Pallet'
import createPalletElement from './Pallet/createPalletElement'

export default class extends Pallet {
  constructor(editor) {
    super(editor, createPalletElement('selection-attribute'))

    // Bind user events to the event emitter.
    delegate(this._el, '.textae-editor__type-pallet__label', 'click', (e) =>
      editor.eventEmitter.emit(
        'textae.selecionAttributePallet.item.label.click',
        e.delegateTarget.dataset.id
      )
    )
    delegate(
      this._el,
      '.textae-editor__type-pallet__remove-button',
      'click',
      () =>
        editor.eventEmitter.emit(
          'textae.selecionAttributePallet.remove-button.click'
        )
    )
  }

  set definition(attrDef) {
    this._definition = attrDef
  }

  get _content() {
    return createContentHtml(this._definition)
  }
}

import Handlebars from 'handlebars'

const html = `
<p class="textae-editor__type-pallet__title">
  <span>predicate: {{pred}}</span>
</p>
<table>
  <tbody>
    <tr>
      <th>id</th>
      <th>label</th>
    </tr>
    {{#if values}}
    {{#each values}}
    <tr class="textae-editor__type-pallet__row"{{#if color}} style="background-color: {{color}};"{{/if}}>
      <td class="textae-editor__type-pallet__label" data-id="{{id}}">
        <span title={{id}}>
          {{id}}
        </span>
        {{#if defaultType}}
          <span class="textae-editor__type-pallet__default-icon" title="This type is set as a default type."></span>
        {{/if}}
      </td>
      <td class="textae-editor__type-pallet__short-label">
        {{label}}
      </td>
    </tr>
    {{/each}}
    {{else}}
    <tr class="textae-editor__type-pallet__row">
      <td class="textae-editor__type-pallet__no-config" colspan="4">There is no values for {{pred}}.</td>
    </tr>
    {{/if}}
  </tbody>
</table>
<p>
  <button class="textae-editor__type-pallet__remove-button">Delete</button>
</p>
`

const template = Handlebars.compile(html)

function createContentHtml(definition) {
  return template({ pred: definition.pred, values: definition.values })
}
