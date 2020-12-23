import inputDefault from './inputDefault'
import inputNumeric from './inputNumeric'

export default function (context) {
  const {
    pred,
    showDefault,
    default: _default,
    showNumeric,
    min,
    max,
    step
  } = context
  return `
<div class="textae-editor__edit-attribute-definition-dialog__container">
  <div class="textae-editor__edit-attribute-definition-dialog__row">
    <div class="textae-editor__edit-attribute-definition-dialog__pred textae-editor__promise-daialog__observable-element">
      <label>Predicate:</label><br>
      <input value="${pred}">
    </div>
    ${inputDefault(showDefault, _default)}
  </div>
  ${inputNumeric(showNumeric, min, max, step)}
</div>`
}
