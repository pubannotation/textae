import PromiseDialog from '../PromiseDialog'
import getInputElementValue from '../getInputElementValue'
import isChanged from './isChanged'
import template from './template'

const componentClassName = `textae-editor__edit-attribute-definition-dialog`

export default class EditAttributeDefinitionDialog extends PromiseDialog {
  constructor(attrDef) {
    super('Please enter new values', template(attrDef), {}, () => {
      const pred = getInputElementValue(
        super.el,
        `.${componentClassName}__pred`
      )
      const defaultValue = getInputElementValue(
        super.el,
        `.${componentClassName}__default-value`
      )

      const diff = new Map()

      if (attrDef.pred !== pred) {
        diff.set('pred', pred)
      }

      if (attrDef.valueType === 'flag') {
        const label = getInputElementValue(
          super.el,
          `.${componentClassName}__label`
        )
        const color = getInputElementValue(
          super.el,
          `.${componentClassName}__color`
        )

        if (attrDef.label !== label) {
          diff.set('label', label)
        }

        if (attrDef.color !== color) {
          diff.set('color', color)
        }
      }

      if (attrDef.valueType === 'string') {
        if (attrDef.default !== defaultValue) {
          diff.set('default', defaultValue)
        }
      }

      if (attrDef.valueType === 'numeric') {
        if (isChanged(attrDef.default, defaultValue)) {
          diff.set('default', parseFloat(defaultValue))
        }

        const min = getInputElementValue(
          super.el,
          `.${componentClassName}__min`
        )
        const max = getInputElementValue(
          super.el,
          `.${componentClassName}__max`
        )
        const step = getInputElementValue(
          super.el,
          `.${componentClassName}__step`
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
    })
  }
}
