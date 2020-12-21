import delegate from 'delegate'
import PromiseDialog from './PromiseDialog'
import getInputElementValue from './getInputElementValue'
import compileHandlebarsTemplate from './compileHandlebarsTemplate'

const template = compileHandlebarsTemplate(`
<div class="textae-editor__create-attribute-definition-dialog__container">
  <div class="textae-editor__create-attribute-definition-dialog__row">
    <label>Attribute type:</label>
    <select class="textae-editor__create-attribute-definition-dialog__value-type">
      <option value="flag"{{#if flagSelected}} selected{{/if}}>flag</option>
      <option value="selection"{{#if selectionSelected}} selected{{/if}}>selection</option>
      <option value="string"{{#if stringSelected}} selected{{/if}}>string</option>
      <option value="numeric"{{#if numericSelected}} selected{{/if}}>numeric</option>
    </select>
  </div>
  <div class="textae-editor__create-attribute-definition-dialog__row">
    <div class="textae-editor__create-attribute-definition-dialog__pred">
      <label>Predicate:</label><br>
      <input value="{{pred}}">
    </div>
    {{#if showDefault}}
      <div class="textae-editor__create-attribute-definition-dialog__default">
        <label>Default:</label><br>
        <input value="{{default}}">
      </div>
    {{/if}}
  </div>
  {{#if showNumeric}}
    <div class="textae-editor__create-attribute-definition-dialog__row">
      <div class="textae-editor__create-attribute-definition-dialog__min">
        <label>Min:</label><br>
        <input type="text" value="{{min}}">
      </div>
      <div class="textae-editor__create-attribute-definition-dialog__max">
        <label>Max:</label><br>
        <input type="text" value="{{max}}">
      </div>
      <div class="textae-editor__create-attribute-definition-dialog__step">
        <label>Step:</label><br>
        <input type="text" value="{{step}}">
      </div>
    </div>
  {{/if}}
</div>`)

export default class CreateAttributeDefinitionDialog extends PromiseDialog {
  constructor() {
    super(
      'Please enter new attribute definition',
      template({}),
      {},
      '.textae-editor__create-attribute-definition-dialog__pred',
      () => {
        const valueType = super.el.querySelector(
          '.textae-editor__create-attribute-definition-dialog__value-type'
        ).value
        const pred = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__pred'
        )
        const default_ = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__default'
        )
        const min = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__min'
        )
        const max = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__max'
        )
        const step = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__step'
        )

        // Numeric Attribute property value type must be Number type.
        if (valueType === 'numeric') {
          return {
            'value type': valueType,
            pred,
            default: parseFloat(default_),
            min: parseFloat(min),
            max: parseFloat(max),
            step: parseFloat(step)
          }
        }

        return {
          'value type': valueType,
          pred,
          default: default_,
          min,
          max,
          step
        }
      }
    )

    delegate(
      super.el,
      '.textae-editor__create-attribute-definition-dialog__value-type',
      'change',
      (e) => {
        const valueType = e.target.value

        const pred = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__pred'
        )
        const default_ = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__default'
        )
        const min = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__min'
        )
        const max = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__max'
        )
        const step = getInputElementValue(
          super.el,
          '.textae-editor__create-attribute-definition-dialog__step'
        )

        const state = {
          pred,
          default: default_,
          min,
          max,
          step,
          showDefault: valueType === 'numeric' || valueType === 'string',
          showNumeric: valueType === 'numeric'
        }
        state[`${valueType}Selected`] = true

        const html = template(state)
        super.el.closest('.ui-dialog-content').innerHTML = html
      }
    )
  }
}
