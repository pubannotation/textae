export default function (componentClassName, defaultValue) {
  return `
    <div class="${componentClassName}__default">
      <label>Default:</label><br>
      <input value="${defaultValue || ''}">
    </div>
  `
}
