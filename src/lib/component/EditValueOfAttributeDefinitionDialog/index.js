import PromiseDialog from '../PromiseDialog'
import getInputElementValue from '../getInputElementValue'
import IntervalNotation from '../../IntervalNotation'
import template from './template'
import enableHTMLElement from '../enableHTMLElement'

export default class EditValueOfAttributeDefinitionDialog extends PromiseDialog {
  constructor(valueType, value = {}) {
    const bindingObject = {
      label: value.label,
      color: value.color
    }

    switch (valueType) {
      case 'numeric':
        bindingObject.labelForRangeOrIdOrPattern = 'range'
        bindingObject.rangeOrIdOrPattern = value.range
        break
      case 'selection':
        bindingObject.labelForRangeOrIdOrPattern = 'id'
        bindingObject.rangeOrIdOrPattern = value.id
        bindingObject.showDefault = true
        bindingObject.default = value.default
        break
      case 'string':
        bindingObject.labelForRangeOrIdOrPattern = 'pattern'
        bindingObject.rangeOrIdOrPattern = value.pattern
        break
      default:
        throw new Error(`${valueType} is Uknown Attribute`)
    }

    super('Please enter new values', template(bindingObject), {}, () => {
      const rangeOrIdOrPattern = getInputElementValue(
        super.el,
        '.textae-editor__add-value-to-attribute-dialog__range_or_id_or_pattern'
      )

      const label = getInputElementValue(
        super.el,
        '.textae-editor__add-value-to-attribute-dialog__label'
      )

      const color = getInputElementValue(
        super.el,
        '.textae-editor__add-value-to-attribute-dialog__color'
      )

      // Set a key only when there is a value.
      const ret = {}
      if (label) {
        ret.label = label
      }
      if (color) {
        ret.color = color
      }

      switch (valueType) {
        case 'numeric':
          ret.range = rangeOrIdOrPattern
          break
        case 'selection':
          ret.id = rangeOrIdOrPattern

          if (
            super.el.querySelector(
              '.textae-editor__add-value-to-attribute-dialog__default input'
            ).checked
          ) {
            ret.default = true
          }

          break
        case 'string':
          ret.pattern = rangeOrIdOrPattern
          break
        default:
        // A value type is checked already.
      }

      return ret
    })

    // validation range
    if (valueType === 'numeric') {
      super.el
        .querySelector(
          '.textae-editor__add-value-to-attribute-dialog__range_or_id_or_pattern'
        )
        .addEventListener('input', (e) => {
          const value = e.target.value
          try {
            new IntervalNotation(value)
            enableHTMLElement(super.button, true)
          } catch (error) {
            enableHTMLElement(super.button, false)
          }
        })
    }

    // validation pattern
    if (valueType === 'string') {
      super.el
        .querySelector(
          '.textae-editor__add-value-to-attribute-dialog__range_or_id_or_pattern'
        )
        .addEventListener('input', (e) => {
          const value = e.target.value
          try {
            new RegExp(value)
            enableHTMLElement(super.button, true)
          } catch (error) {
            enableHTMLElement(super.button, false)
          }
        })
    }

    // validation color
    super.el
      .querySelector('.textae-editor__add-value-to-attribute-dialog__color')
      .addEventListener('input', (e) => {
        const value = e.target.value
        enableHTMLElement(
          super.button,
          !value || /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(value)
        )
      })
  }
}
