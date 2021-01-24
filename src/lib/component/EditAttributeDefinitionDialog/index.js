import PromiseDialog from '../PromiseDialog'
import getInputElementValue from '../getInputElementValue'
import isChanged from './isChanged'
import template from './template'

export default class EditAttributeDefinitionDialog extends PromiseDialog {
  constructor(attrDef) {
    super(
      'Please enter new values',
      template({
        pred: attrDef.pred,
        default: attrDef.default,
        min: attrDef.min,
        max: attrDef.max,
        step: attrDef.step,
        valueType: attrDef.valueType
      }),
      {},
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

        if (attrDef.pred !== pred) {
          diff.set('pred', pred)
        }

        if (attrDef.valueType === 'string') {
          if (attrDef.default !== default_) {
            diff.set('default', default_)
          }
        }

        if (attrDef.valueType === 'numeric') {
          if (isChanged(attrDef.default, default_)) {
            diff.set('default', parseFloat(default_))
          }

          if (isChanged(attrDef.min, min)) {
            diff.set('min', parseFloat(min))
          }

          if (isChanged(attrDef.max, max)) {
            diff.set('max', parseFloat(max))
          }

          if (isChanged(attrDef.step, step)) {
            diff.set('step', parseFloat(step))
          }
        }

        return diff
      }
    )
  }
}
