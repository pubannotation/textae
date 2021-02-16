export default function (context) {
  const { values } = context.attrDef

  return `
  <div>
    <table>
      <tbody>
        <tr>
          <th>id</th>
          <th>label</th>
          <th>color</th>
        </tr>
        ${values
          .map(
            ({ color = '', id, default: defaultValue, label = '' }) =>
              `
        <tr class="textae-editor__type-pallet__row" style="background-color: ${color};">
          <td class="textae-editor__type-pallet__selection-attribute-label" data-id="${id}">
            ${id}
            ${
              defaultValue
                ? '<span class="textae-editor__type-pallet__default-icon" title="This type is set as a default type."></span>'
                : ''
            }
          </td>
          <td class="textae-editor__type-pallet__short-label">
            ${label}
          </td>
          <td class="textae-editor__type-pallet__short-label">
            ${color}
          </td>
        </tr>
        `
          )
          .join('\n')}
      </tbody>
    </table>
  </div>
  `
}
