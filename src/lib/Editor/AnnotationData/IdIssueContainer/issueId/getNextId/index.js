import getIssuedNumbers from './getIssuedNumbers/inedx'
import getNextNumber from './getNextNumber'

export default function (prefix, existsIds) {
  const numbers = getIssuedNumbers(existsIds, prefix)
  const nextNumber = getNextNumber(numbers)

  return prefix + nextNumber
}
