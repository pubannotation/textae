import anemone from '../anemone'

export default function (componentClassName, mediaHeight) {
  return () => anemone`
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
