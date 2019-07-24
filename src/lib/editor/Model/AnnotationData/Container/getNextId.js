export default function(prefix, existsIds) {
  const numbers = getIssuedNumbers(existsIds, prefix),
    nextNumber = getNextNumber(numbers)

  return prefix + nextNumber
}

function getNextNumber(numbers) {
  // The Math.max retrun -Infinity when the second argument array is empty.
  const max = numbers.length === 0 ? 0 : Math.max(...numbers),
    nextNumber = max + 1

  return nextNumber
}

function getIssuedNumbers(ids, prefix) {
  return ids.filter((id) => isWellFormed(prefix, id)).map(onlyNumber)
}

function isWellFormed(prefix, id) {
  // The format of id is a prefix and a number, for exapmle 'T1'.
  const reg = new RegExp(`^${prefix}\\d+$`)

  return reg.test(id)
}

function onlyNumber(id) {
  return id.slice(1)
}
