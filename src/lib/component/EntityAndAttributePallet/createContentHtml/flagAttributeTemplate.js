import headerTemplate from './headerTemplate'
import predicateControllerTemplate from './predicateControllerTemplate'

export default function (context) {
  const { pred } = context.attrDef

  return `
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__type-pallet__predicate">
      ${predicateControllerTemplate(context)}
    </div>
  </div>
  `
}
