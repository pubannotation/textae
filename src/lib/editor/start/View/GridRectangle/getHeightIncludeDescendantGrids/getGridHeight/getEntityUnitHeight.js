import typeGapUnitHeight from '../../../typeGapUnitHeight'

const labelUnitHegiht = 18

export default function (typeGap) {
  return typeGap.value * typeGapUnitHeight + labelUnitHegiht
}
