import PromiseDialog from '../PromiseDialog'
import createContentHtml from './createContentHtml'
import getInputElementValue from '../getInputElementValue'

export default class extends PromiseDialog {
  constructor(attrDef) {
    const json = attrDef.JSON

    super(
      'Please enter new values',
      createContentHtml({
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
          if (json.default !== parseFloat(default_)) {
            diff.set('default', parseFloat(default_))
          }

          if (json.min !== parseFloat(min)) {
            diff.set('min', parseFloat(min))
          }

          if (json.max !== parseFloat(max)) {
            diff.set('max', parseFloat(max))
          }

          if (json.step !== parseFloat(step)) {
            diff.set('step', parseFloat(step))
          }
        }

        return diff
      }
    )
  }
}
