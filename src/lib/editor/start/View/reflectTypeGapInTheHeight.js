import typeGapUnitHeight from './typeGapUnitHeight'

export default function(el, typeGap) {
  el.setAttribute(
    'style',
    `margin-top: ${typeGapUnitHeight * typeGap.value}px;`
  )
}
