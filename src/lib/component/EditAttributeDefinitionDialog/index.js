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
        label: attrDef.label,
        color: attrDef.color,
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

        const diff = new Map()

        if (attrDef.pred !== pred) {
          diff.set('pred', pred)
        }

        if (attrDef.valueType === 'flag') {
          const label = getInputElementValue(
            super.el,
            '.textae-editor__edit-attribute-definition-dialog__label'
          )
          const color = getInputElementValue(
            super.el,
            '.textae-editor__edit-attribute-definition-dialog__color'
          )

          if (attrDef.label !== label) {
            diff.set('label', label)
          }

          if (attrDef.color !== color) {
            diff.set('color', color)
          }
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
