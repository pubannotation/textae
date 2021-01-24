import toAnchorElement from './toAnchorElement'

export default function ({ title, pred, obj, color, href, label }) {
  return `
<div
  class="textae-editor__entity__attribute"
  title="${title}"
  data-pred="${pred}"
  data-obj="${obj}"
  ${color ? `style="background-color: ${color};"` : ''}
  >
  <span class="textae-editor__entity__attribute-label">
    ${toAnchorElement(href, label)}
  </span>
</div>
`
}
