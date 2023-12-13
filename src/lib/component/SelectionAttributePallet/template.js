import anemone from '../anemone'

export default function (context) {
  const { values } = context.attrDef

  return anemone`
  <div>
    <table>
      <tbody>
        <tr>
          <th>id</th>
          <th>label</th>
          <th>color</th>
        </tr>
        ${() =>
          values.map(
            ({ color = '', id, default: defaultValue, label = '' }) =>
              anemone`
        <tr class="textae-editor__pallet__row" style="background-color: ${color};">
          <td class="textae-editor__pallet__selection-attribute-label" data-id="${id}">
            ${id}
            ${() =>
              defaultValue
                ? '<span class="textae-editor__pallet__default-icon" title="This type is set as a default type."></span>'
                : ''}
          </td>
          <td class="textae-editor__pallet__short-label">
            ${label}
          </td>
          <td class="textae-editor__pallet__short-label">
            ${color}
          </td>
        </tr>
        `
          )}
      </tbody>
    </table>
  </div>
  `
}
