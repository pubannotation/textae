import { diff } from 'jsondiffpatch'
import Pallet from './Pallet'
import createPalletElement from './Pallet/createPalletElement'

function template(context) {
  const { isLock, hasDiff, types } = context
  return `
<p class="textae-editor__type-pallet__title">
  <span>Relation configuration</span>
  <span class="textae-editor__type-pallet__lock-icon" style="display: ${
    isLock ? `inline-block` : `none`
  };">locked</span>
</p>
<div class="textae-editor__type-pallet__buttons">
  ${
    isLock
      ? ''
      : `
  <span class="textae-editor__type-pallet__button textae-editor__type-pallet__add-button" title="Add new type"></span>
  `
  }
  <span class="textae-editor__type-pallet__button textae-editor__type-pallet__read-button" title="Import"></span>
  <span class="textae-editor__type-pallet__button textae-editor__type-pallet__write-button ${
    hasDiff ? `textae-editor__type-pallet__write-button--transit` : ``
  }" title="Upload"></span>
</div>
<table>
  <tbody>
    <tr>
      <th>id</th>
      <th>label</th>
      <th title="Number of annotations.">#</th>
      <th></th>
    </tr>
    ${
      types
        ? `
    ${types
      .map(
        ({ color, id, uri, defaultType, label, useNumber }) => `
    <tr class="textae-editor__type-pallet__row" style="background-color: ${color};">
      <td class="textae-editor__type-pallet__label" data-id="${id}">
        <span title=${id}>
          ${id}
        </span>
        ${
          uri
            ? `
        <a href="${uri}" target="_blank"><span class="textae-editor__type-pallet__link"></span></a>
        `
            : ``
        }
        ${
          defaultType
            ? `
        <span class="textae-editor__type-pallet__default-icon" title="This type is set as a default type."></span>
        `
            : ``
        }
      </td>
      <td class="textae-editor__type-pallet__short-label">
        ${label || ''}
      </td>
      <td class="textae-editor__type-pallet__use-number">
        ${useNumber ? `${useNumber}` : `0`}
      </td>
      <td class="textae-editor__type-pallet__table-buttons">
        <button
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__select-all ${
            useNumber
              ? `textae-editor__type-pallet__table-button--disabled`
              : ``
          }"
          title="Select all the cases of this type."
          data-id="${id}"
          data-use-number="${useNumber}">
        </button>
        ${
          isLock
            ? ``
            : `
        <button
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__edit-type"
          title="Edit this type." data-id="${id}"
          data-color="${color}"
          data-is-default="${defaultType}">
        </button>
        <button 
          type="button"
          class="textae-editor__type-pallet__table-button textae-editor__type-pallet__remove ${
            useNumber
              ? `textae-editor__type-pallet__table-button--disabled`
              : ``
          }"
          title="${
            useNumber
              ? `To activate this button, remove all the annotations of this type.`
              : `Remove this type.`
          }"
          data-id="${id}"
          data-label="${label}">
        </button>
        `
        }
      </td>
    </tr>
    `
      )
      .join('\n')}
    `
        : `
    <tr class="textae-editor__type-pallet__row">
      <td class="textae-editor__type-pallet__no-config" colspan="4">There is no Relation definition.</td>
    </tr>
    `
    }
  </tbody>
</table>
`
}

export default class RelationPallet extends Pallet {
  constructor(editor, originalData, typeDefinition) {
    super(editor, createPalletElement('relation'))

    this._originalData = originalData
    this._typeDefinition = typeDefinition
    this._typeContainer = typeDefinition.relation
  }

  get _content() {
    const hasDiff = diff(
      this._originalData.configuration,
      Object.assign(
        {},
        this._originalData.configuration,
        this._typeDefinition.config
      )
    )

    return template({
      isLock: this._typeContainer.isLock,
      hasDiff,
      types: this._typeContainer.pallet
    })
  }
}
