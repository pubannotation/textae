import typeGapUnitHeight from '../../../typeGapUnitHeight'
import getHeightOfEntityEndpointZone from './getHeightOfEntityEndpointZone'

const labelUnitHegiht = 18

export default function (typeGap) {
  return (
    typeGap.value * typeGapUnitHeight +
    labelUnitHegiht +
    getHeightOfEntityEndpointZone(typeGap)
  )
}
