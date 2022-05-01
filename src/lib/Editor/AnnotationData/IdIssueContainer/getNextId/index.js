import getNextNumber from './getNextNumber'

export default function (prefix, existsIds) {
  // The format of id is a prefix and a number, for exapmle 'T1'.
  const numbers = existsIds
    .filter((id) => new RegExp(`^${prefix}\\d+$`).test(id))
    .map((id) => id.slice(1))

  const nextNumber = getNextNumber(numbers)

  return prefix + nextNumber
}
