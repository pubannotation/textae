import getRandomColorString from '../getRandomColorString'

export default function (componentClassName, label, color) {
  return `
    <div class="${componentClassName}__row">
      <label>Label</label>
      <input
        type="text"
        value="${label || ''}"
        class="${componentClassName}__label"
      >
    </div>
    <div class="${componentClassName}__row">
      <label>Color</label>
      <input
        type="color"
        value="${color || getRandomColorString()}"
        class="${componentClassName}__color"
      >
    </div>
  `
}
