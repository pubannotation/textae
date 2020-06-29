import typeGapUnitHeight from './typeGapUnitHeight'

export default function(el, typeGap) {
  el.setAttribute('style', `height: ${typeGapUnitHeight * typeGap.value}px;`)
}
