import anemone from '../anemone'
import toBodyRow from './toBodyRow'

export default function (context) {
  const { values } = context.attrDef

  return anemone`
  <div>
    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>label</th>
          <th>color</th>
        </tr>
      </thead>
      <tbody>
        ${values.map(({ color = '', id, default: defaultValue, label = '' }) =>
          toBodyRow(color, id, defaultValue, label)
        )}
      </tbody>
    </table>
  </div>
  `
}
