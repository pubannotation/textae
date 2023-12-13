import headerTemplate from '../headerTemplate'
import showAddAttributeValueButton from '../showAddAttributeValueButton'
import predicateControllerTemplate from '../predicateControllerTemplate'
import anemone from '../../../anemone'
import toBodyRow from './toBodyRow'

export default function (context, attributeContainer) {
  const { values } = context.attrDef
  const { isLock, selectedPred } = context

  return anemone`
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__pallet__predicate">
      ${predicateControllerTemplate(context)}
    </div>

    <table>
      <thead>
        <tr>
          <th>id</th>
          <th>label</th>
          <th>color</th>
          ${showAddAttributeValueButton(isLock)}
        </tr>
      </thead>
      <tbody>
        ${() =>
          values.map(
            ({ color = '', id, default: defaultValue, label = '' }, index) =>
              toBodyRow(
                color,
                id,
                defaultValue,
                label,
                isLock,
                index,
                attributeContainer,
                selectedPred
              )
          )}
      </tbody>
    </table>
  </div>
  `
}
