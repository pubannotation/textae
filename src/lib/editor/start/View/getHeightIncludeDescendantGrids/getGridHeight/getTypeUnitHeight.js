import typeGapUnitHeight from '../../typeGapUnitHeight'
import getHeightOfEntityPane from './getHeightOfEntityPane'

const labelUnitHegiht = 18

export default function(typeGap) {
  return typeGap.value * typeGapUnitHeight + labelUnitHegiht + getHeightOfEntityPane(typeGap)
}
