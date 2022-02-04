export default function ({ type, title, classList }) {
  return `
<span 
class="${classList.join(' ')}" 
title="${title}" 
data-button-type="${type}">
</span>
`
}
