export default function (componentClassName, min, max, step) {
  return `
    <div class="${componentClassName}__row">
      <div class="${componentClassName}__min">
        <label>Min:</label><br>
        <input type="text" value="${min || ''}">
      </div>
      <div class="${componentClassName}__max">
        <label>Max:</label><br>
        <input type="text" value="${max || ''}">
      </div>
      <div class="${componentClassName}__step">
        <label>Step:</label><br>
        <input type="text" value="${step || ''}">
      </div>
    </div>
  `
}
