import { escape } from 'lodash'
import headerTemplate from './headerTemplate'
import predicateControllerTemplate from './predicateControllerTemplate'

export default function (context) {
  const { label, color } = context.attrDef

  return `
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__pallet__predicate">
      ${predicateControllerTemplate(context)}
      label: "${escape(label) || ''}"
      color: "${color || ''}"
    </div>
  </div>
  `
}
