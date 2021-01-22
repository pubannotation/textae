import inputDefault from '../inputDefault'
import inputNumeric from '../inputNumeric'

export default function (context) {
  const {
    flagSelected,
    selectionSelected,
    stringSelected,
    numericSelected,
    pred,
    showDefault,
    default: _default,
    showNumeric,
    min,
    max,
    step
  } = context
  const componentClassName = 'textae-editor__create-attribute-definition-dialog'

  return `
<div class="${componentClassName}__container">
  <div class="${componentClassName}__row">
    <label>Attribute type:</label>
    <select class="${componentClassName}__value-type">
      <option value="flag"${flagSelected ? ` selected` : ``}>
        flag
        </option>
      <option value="selection"${selectionSelected ? ` selected` : ``}>
        selection
      </option>
      <option value="string"${stringSelected ? ` selected` : ``}>
        string
      </option>
      <option value="numeric"${numericSelected ? ` selected` : ``}>
        numeric
      </option>
    </select>
  </div>
  <div class="${componentClassName}__row">
    <div class="${componentClassName}__pred textae-editor__promise-daialog__observable-element">
      <label>Predicate:</label><br>
      <input value="${pred || ''}">
    </div>
    ${showDefault ? `${inputDefault(componentClassName, _default)}` : ''}
  </div>
  ${showNumeric ? `${inputNumeric(componentClassName, min, max, step)}` : ''}
</div>`
}
