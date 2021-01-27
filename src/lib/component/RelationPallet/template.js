import toRow from './toRow'

export default function (context) {
  const { isLock, hasDiff, types } = context
  return `
<p class="textae-editor__type-pallet__title">
  <span 
    class="textae-editor__type-pallet__lock-icon" 
    style="display: ${isLock ? `inline-block` : `none`};">
    locked
  </span>
</p>
<div class="textae-editor__type-pallet__buttons">
  <span 
    class="textae-editor__type-pallet__button textae-editor__type-pallet__read-button" 
    title="Import"></span>
  <span 
    class="textae-editor__type-pallet__button textae-editor__type-pallet__write-button ${
      hasDiff ? `textae-editor__type-pallet__write-button--transit` : ``
    }" 
    title="Upload"></span>
</div>
<table>
  <tbody>
    <tr>
      <th>id</th>
      <th>label</th>
      <th title="Number of annotations.">#</th>
      <th>
        ${
          isLock
            ? ''
            : `
        <span 
          class="textae-editor__type-pallet__add-button" 
          title="Add new type"></span>
        `
        }
      </th>
    </tr>
    ${
      types
        ? `
    ${types.map(toRow(isLock)).join('\n')}
    `
        : `
    <tr class="textae-editor__type-pallet__row">
      <td 
        class="textae-editor__type-pallet__no-config" 
        colspan="4">
        There is no Relation definition.
      </td>
    </tr>
    `
    }
  </tbody>
</table>
`
}
