export default function (componentClassName, mediaHeight) {
  return `
    <div class="${componentClassName}__row">
      <label>Media Height</label>
      <input
        type="text"
        value="${mediaHeight || ''}"
        class="${componentClassName}__media-height"
      >
    </div>
  `
}
