import typeGapUnitHeight from './typeGapUnitHeight'

export default function(el, typeGap) {
  el.setAttribute(
    'style',
    `padding-top: ${typeGapUnitHeight * typeGap.value}px;`
  )
}
