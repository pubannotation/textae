import {
  MAX,
  MIN,
  STEP
} from '../../editorize/AttributeDefinitionContainer/createAttributeDefinition/NumericAttributeDefinition'

export default function (componentClassName, min, max, step) {
  return `
    <div class="${componentClassName}__row">
      <label>Min</label>
      <input
        type="text"
        value="${min || MIN}"
        class="${componentClassName}__min"
      >
    </div>
    <div class="${componentClassName}__row">
      <label>Max</label>
      <input
        type="text"
        value="${max || MAX}"
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
