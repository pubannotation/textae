export default function (componentClassName, _default) {
  return `
    <div class="${componentClassName}__default">
      <label>Default:</label><br>
      <input value="${_default || ''}">
    </div>
  `
}
