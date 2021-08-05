export default function (componentClassName, defaultValue) {
  return `
  <div class="${componentClassName}__row">
    <label>Default</label>
    <input
      value="${defaultValue || ''}"
      class="${componentClassName}__default-value"
    >
  </div>
  `
}
