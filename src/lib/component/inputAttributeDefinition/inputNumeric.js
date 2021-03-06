export default function (componentClassName, min, max, step) {
  return `
    <div class="${componentClassName}__row">
      <div class="${componentClassName}__min">
        <label>Min:</label><br>
        <input type="text" value="${min || 0}">
      </div>
      <div class="${componentClassName}__max">
        <label>Max:</label><br>
        <input type="text" value="${max || 0}">
      </div>
      <div class="${componentClassName}__step">
        <label>Step:</label><br>
        <input type="text" value="${step || 0}">
      </div>
    </div>
  `
}
