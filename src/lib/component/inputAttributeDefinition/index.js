import inputDefault from './inputDefault'
import inputLabelAndColor from './inputLabelAndColor'
import inputNumeric from './inputNumeric'
import inputHeight from './inputHeight'

export default function (componentClassName, context) {
  const {
    pred,
    default: defaultValue,
    label,
    color,
    min,
    max,
    height,
    step,
    valueType
  } = context

  const showDefault =
    valueType === 'numeric' || valueType === 'string' || valueType === 'media'
  const showLabelAndColor = valueType === 'flag'
  const showNumeric = valueType === 'numeric'
  const showHeight = valueType === 'media'

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
      showLabelAndColor
        ? `${inputLabelAndColor(componentClassName, label, color)}`
        : ''
    }
    ${showNumeric ? `${inputNumeric(componentClassName, min, max, step)}` : ''}
    ${showHeight ? `${inputHeight(componentClassName, height)}` : ''}
  `
}
