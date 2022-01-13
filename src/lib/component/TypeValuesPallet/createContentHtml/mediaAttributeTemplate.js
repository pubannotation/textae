import headerTemplate from './headerTemplate'
import predicateControllerTemplate from './predicateControllerTemplate'

export default function (context) {
  const { default: defaultValue, height } = context.attrDef

  return `
  ${headerTemplate(context)}
  <div>
    <div class="textae-editor__pallet__predicate">
      ${predicateControllerTemplate(context)}
      height: "${height || ''}"
      default: ${defaultValue}
    </div>
  </div>
  `
}
