export default function toFunctionAvailabilityLabelElement(
  functionAvailability,
  name
) {
  return `
<label class="textae-editor__setting-dialog__function-availability-label">
  <input
    type="checkbox"
    class="textae-editor__setting-dialog__function-availability-checkbox"
    ${functionAvailability.isAvailable(name) ? `checked="checked"` : ''}>
  ${name}
</label>`
}
