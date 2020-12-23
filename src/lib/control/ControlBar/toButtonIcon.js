export default function ({ type, title }) {
  return `
<span 
class="textae-control__icon textae-control__${type}-button" 
title="${title}" 
data-button-type="${type}">
</span>
`
}
