import eskape from 'eskape'

export default function (componentClassName, defaultValue) {
  return eskape`
  <div class="${componentClassName}__row">
    <label>Default</label>
    <input
      value="${defaultValue || ''}"
      class="${componentClassName}__default-value"
    >
  </div>
  `
}
