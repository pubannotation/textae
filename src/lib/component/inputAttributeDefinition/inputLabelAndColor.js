export default function (componentClassName, label, color) {
  return `
    <div class="${componentClassName}__row">
      <div class="${componentClassName}__label">
        <label>Label:</label><br>
        <input type="text" value="${label || ''}">
      </div>
    </div>
    <div class="${componentClassName}__row">
      <div class="${componentClassName}__color">
        <label>Color:</label><br>
        <input type="color" value="${color || ''}">
      </div>
    </div>
  `
}
