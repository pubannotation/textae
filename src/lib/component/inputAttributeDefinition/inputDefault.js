import anemone from '../anemone'

export default function (componentClassName, defaultValue) {
  return () => anemone`
  <div class="${componentClassName}__row">
    <label>Default</label>
    <input
      value="${defaultValue || ''}"
      class="${componentClassName}__default-value"
    >
  </div>
  `
}
