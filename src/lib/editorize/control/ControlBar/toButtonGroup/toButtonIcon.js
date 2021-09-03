export default function ({ type, title }) {
  return `
<span 
class="textae-control-icon textae-control-${type}-button" 
title="${title}" 
data-button-type="${type}">
</span>
`
}
