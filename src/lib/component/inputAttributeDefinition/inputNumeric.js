import { STEP } from '../../NumericAttributeDefinition'
import anemone from '../anemone'

export default function (componentClassName, min, max, step) {
  return anemone`
    <div class="${componentClassName}__row">
      <label>Min</label>
      <input
        type="text"
        value="${min || ''}"
        class="${componentClassName}__min"
      >
    </div>
    <div class="${componentClassName}__row">
      <label>Max</label>
      <input
        type="text"
        value="${max || ''}"
        class="${componentClassName}__max"
      >
    </div>
    <div class="${componentClassName}__row">
      <label>Step</label>
      <input
        type="text"
        value="${step || STEP}"
        class="${componentClassName}__step"
      >
    </div>
  `
}
