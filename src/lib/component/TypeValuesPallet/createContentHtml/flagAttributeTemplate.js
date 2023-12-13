import headerTemplate from './headerTemplate'
import predicateControllerTemplate from './predicateControllerTemplate'
import anemone from '../../anemone'

export default function (context) {
  const { label, color } = context.attrDef

  return anemone`
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__pallet__predicate">
      ${() => predicateControllerTemplate(context)}
      label: "${label || ''}"
      color: "${color || ''}"
    </div>
  </div>
  `
}
