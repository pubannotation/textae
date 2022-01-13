import inputDefault from './inputDefault'
import inputMediaHeight from './inputMediaHeight'
import inputLabelAndColor from './inputLabelAndColor'
import inputNumeric from './inputNumeric'

export default function (componentClassName, context) {
  const {
    pred,
    default: defaultValue,
    mediaHeight,
    label,
    color,
    min,
    max,
    step,
    valueType
  } = context

  const showDefault = valueType === 'numeric' || valueType === 'string'
  const showMediaHeight = valueType === 'string'
  const showLabelAndColor = valueType === 'flag'
  const showNumeric = valueType === 'numeric'

  return `
    <div class="${componentClassName}__row">
      <label>Predicate</label>
      <input
        value="${pred || ''}"
        class="${componentClassName}__pred textae-editor__promise-daialog__observable-element"
      >
    </div>
    ${showDefault ? `${inputDefault(componentClassName, defaultValue)}` : ''}
    ${
      showMediaHeight
        ? `${inputMediaHeight(componentClassName, mediaHeight)}`
        : ''
    }
    ${
      showLabelAndColor
        ? `${inputLabelAndColor(componentClassName, label, color)}`
        : ''
    }
    ${showNumeric ? `${inputNumeric(componentClassName, min, max, step)}` : ''}
  `
}
