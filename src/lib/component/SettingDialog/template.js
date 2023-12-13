import anemone from '../anemone'

export default function template(context) {
  const {
    typeGap,
    typeGapDisabled,
    lineHeight,
    typeDefinitionLocked,
    version
  } = context

  return anemone`
<div class="textae-editor__setting-dialog__container">
  <div class="textae-editor__setting-dialog__row">
    <label>Type Gap</label>
    <input
      type="number"
      class="textae-editor__setting-dialog__type-gap-text"
      step="1"
      min="0"
      max="5"
      value="${typeGap}" ${typeGapDisabled ? `disabled="disabled"` : ''}>
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>Line Height(px)</label>
    <input
      type="number" class="textae-editor__setting-dialog__line-height-text"
      step="1"
      min="50"
      max="500"
      value="${lineHeight}">
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>
      <input
        type="checkbox"
        class="textae-editor__setting-dialog__lock-config-text"
        ${typeDefinitionLocked ? `checked="checked"` : ''}>
      Lock Edit Config
    </label>
  </div>
  <div class="textae-editor__setting-dialog__row">
    <label>Version ${version}</label>
  </div>
</div>
`
}
