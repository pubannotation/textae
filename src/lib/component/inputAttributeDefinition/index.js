import anemone from '../anemone'
import inputAutocomletionWs from './inputAutocompletionWs'
import inputDefault from './inputDefault'
import inputLabelAndColor from './inputLabelAndColor'
import inputMediaHeight from './inputMediaHeight'
import inputNumeric from './inputNumeric'

export default function (componentClassName, context) {
  const {
    pred,
    autocompletionWs,
    default: defaultValue,
    mediaHeight,
    label,
    color,
    min,
    max,
    step,
    valueType
  } = context

  const showAutocompletionWs = valueType === 'string'
  const showDefault = valueType === 'numeric' || valueType === 'string'
  const showMediaHeight = valueType === 'string'
  const showLabelAndColor = valueType === 'flag'
  const showNumeric = valueType === 'numeric'

  return anemone`
    <div class="${componentClassName}__row">
      <label>Predicate</label>
      <input
        value="${pred || ''}"
        class="${componentClassName}__pred textae-editor__promise-dialog__observable-element"
      >
    </div>
    ${showAutocompletionWs ? inputAutocomletionWs(componentClassName, autocompletionWs) : ''}
    ${showDefault ? inputDefault(componentClassName, defaultValue) : ''}
    ${showMediaHeight ? inputMediaHeight(componentClassName, mediaHeight) : ''}
    ${
      showLabelAndColor
        ? inputLabelAndColor(componentClassName, label, color)
        : ''
    }
    ${showNumeric ? inputNumeric(componentClassName, min, max, step) : ''}
  `
}
