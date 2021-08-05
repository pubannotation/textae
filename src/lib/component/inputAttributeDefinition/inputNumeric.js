export default function (componentClassName, min, max, step) {
  return `
    <div class="${componentClassName}__row">
      <label>Min</label>
      <input
        type="text"
        value="${min || 0}"
        class="${componentClassName}__min"
      >
    </div>
    <div class="${componentClassName}__row">
      <label>Max</label>
      <input
        type="text"
        value="${max || 0}"
        class="${componentClassName}__max"
      >
    </div>
    <div class="${componentClassName}__row">
      <label>Step</label>
      <input
        type="text"
        value="${step || 0}"
        class="${componentClassName}__step"
      >
    </div>
  `
}
