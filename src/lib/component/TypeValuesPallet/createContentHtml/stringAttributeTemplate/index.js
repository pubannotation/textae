import anemone from '../../../anemone'
import headerTemplate from '../headerTemplate'
import predicateControllerTemplate from '../predicateControllerTemplate'
import showAddAttributeValueButton from '../showAddAttributeValueButton'
import toBodyRow from './toBodyRow'

export default function (context) {
  const { default: defaultValue, mediaHeight, values } = context.attrDef
  const { isLock } = context

  return anemone`
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__pallet__predicate">
      ${predicateControllerTemplate(context)}
      media height: ${mediaHeight || '""'}
      default: ${defaultValue}
    </div>

    <table>
      <thead>
        <tr>
          <th>pattern</th>
          <th>label</th>
          <th>color</th>
          ${showAddAttributeValueButton(isLock)}
        </tr>
      </thead>
      <tbody>
        ${values.map(
          ({ color = ' ', pattern = '', label = '', indelible }, index) =>
            toBodyRow(color, pattern, label, isLock, index, indelible)
        )}
      </tbody>
    </table>
  </div>
  `
}
