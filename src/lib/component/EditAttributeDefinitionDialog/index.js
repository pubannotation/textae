import PromiseDialog from '../PromiseDialog'
import getInputElementValue from '../getInputElementValue'
import isChanged from './isChanged'
import compileHandlebarsTemplate from '../../compileHandlebarsTemplate'

const template = compileHandlebarsTemplate(`
<div class="textae-editor__edit-attribute-definition-dialog__container">
  <div class="textae-editor__edit-attribute-definition-dialog__row">
    <div class="textae-editor__edit-attribute-definition-dialog__pred">
      <label>Predicate:</label><br>
      <input value="{{pred}}">
    </div>
    {{#if showDefault}}
      <div class="textae-editor__edit-attribute-definition-dialog__default">
        <label>Default:</label><br>
        <input value="{{default}}">
      </div>
    {{/if}}
  </div>
  {{#if showNumeric}}
    <div class="textae-editor__edit-attribute-definition-dialog__row">
      <div class="textae-editor__edit-attribute-definition-dialog__min">
        <label>Min:</label><br>
        <input type="text" value="{{min}}">
      </div>
      <div class="textae-editor__edit-attribute-definition-dialog__max">
        <label>Max:</label><br>
        <input type="text" value="{{max}}">
      </div>
      <div class="textae-editor__edit-attribute-definition-dialog__step">
        <label>Step:</label><br>
        <input type="text" value="{{step}}">
      </div>
    </div>
  {{/if}}
</div>`)

export default class EditAttributeDefinitionDialog extends PromiseDialog {
  constructor(attrDef) {
    const json = attrDef.JSON

    super(
      'Please enter new values',
      template({
        pred: json.pred,
        default: json.default,
        min: json.min,
        max: json.max,
        step: json.step,
        showDefault:
          attrDef.valueType === 'numeric' || attrDef.valueType === 'string',
        showNumeric: attrDef.valueType === 'numeric'
      }),
      {},
      '.textae-editor__edit-attribute-definition-dialog__pred',
      () => {
        const pred = getInputElementValue(
          super.el,
          '.textae-editor__edit-attribute-definition-dialog__pred'
        )
        const default_ = getInputElementValue(
          super.el,
          '.textae-editor__edit-attribute-definition-dialog__default'
        )
        const min = getInputElementValue(
          super.el,
          '.textae-editor__edit-attribute-definition-dialog__min'
        )
        const max = getInputElementValue(
          super.el,
          '.textae-editor__edit-attribute-definition-dialog__max'
        )
        const step = getInputElementValue(
          super.el,
          '.textae-editor__edit-attribute-definition-dialog__step'
        )

        const diff = new Map()

        if (json.pred !== pred) {
          diff.set('pred', pred)
        }

        if (attrDef.valueType === 'string') {
          if (json.default !== default_) {
            diff.set('default', default_)
          }
        }

        if (attrDef.valueType === 'numeric') {
          if (isChanged(json.default, default_)) {
            diff.set('default', parseFloat(default_))
          }

          if (isChanged(json.min, min)) {
            diff.set('min', parseFloat(min))
          }

          if (isChanged(json.max, max)) {
            diff.set('max', parseFloat(max))
          }

          if (isChanged(json.step, step)) {
            diff.set('step', parseFloat(step))
          }
        }

        return diff
      }
    )
  }
}
