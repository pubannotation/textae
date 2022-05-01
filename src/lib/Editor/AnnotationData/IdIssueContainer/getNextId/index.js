export default function (prefix, existsIds) {
  // The format of id is a prefix and a number, for exapmle 'T1'.
  const numbers = existsIds
    .filter((id) => new RegExp(`^${prefix}\\d+$`).test(id))
    .map((id) => id.slice(1))

  // The Math.max retrun -Infinity when the second argument array is empty.
  const max = numbers.length === 0 ? 0 : Math.max(...numbers)

  return prefix + (max + 1)
}
