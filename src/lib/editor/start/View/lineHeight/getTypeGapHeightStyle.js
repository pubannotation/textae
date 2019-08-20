import typeGapUnitHeight from '../typeGapUnitHeight'

export default function(typeGap) {
  return `height: ${typeGapUnitHeight * typeGap.value}px;`
}
