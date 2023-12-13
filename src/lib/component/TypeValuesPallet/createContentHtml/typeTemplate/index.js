import headerTemplate from '../headerTemplate'
import anemone from '../../../anemone'
import toTypeRow from './toTypeRow'

export default function (context) {
  const { types, isLock } = context

  return anemone`
  ${headerTemplate(context)}
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
              : () =>
                  '<span class="textae-editor__pallet__add-button" title="Add new type"></span>'
          }
        </th>
      </tr>
      ${
        types
          ? types.map(
              ({ color = '', id, uri, defaultType, label = '', useNumber }) =>
                toTypeRow(color, id, uri, defaultType, label, useNumber, isLock)
            )
          : () => `
      <tr class="textae-editor__pallet__row">
        <td class="textae-editor__pallet__no-config" colspan="4">There is no Entity definition.</td>
      </tr>
      `
      }
    </tbody>
  </table>
  `
}
