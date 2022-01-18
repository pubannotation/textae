import typeGapUnitHeight from '../typeGapUnitHeight'

const labelUnitHegiht = 18

/**
 *
 * @param {number} typeGap
 * @returns
 */
export default function (typeGap) {
  return typeGap * typeGapUnitHeight + labelUnitHegiht
}
