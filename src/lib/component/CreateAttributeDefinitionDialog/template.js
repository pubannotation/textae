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
  return `
<div class="textae-editor__create-attribute-definition-dialog__container">
  <div class="textae-editor__create-attribute-definition-dialog__row">
    <label>Attribute type:</label>
    <select class="textae-editor__create-attribute-definition-dialog__value-type">
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
  <div class="textae-editor__create-attribute-definition-dialog__row">
    <div class="textae-editor__create-attribute-definition-dialog__pred textae-editor__promise-daialog__observable-element">
      <label>Predicate:</label><br>
      <input value="${pred || ''}">
    </div>
    ${
      showDefault
        ? `${inputDefault(
            'textae-editor__create-attribute-definition-dialog',
            _default
          )}`
        : ''
    }
  </div>
  ${
    showNumeric
      ? `${inputNumeric(
          'textae-editor__create-attribute-definition-dialog',
          min,
          max,
          step
        )}`
      : ''
  }
</div>`
}
