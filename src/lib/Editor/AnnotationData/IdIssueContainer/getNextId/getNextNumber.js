export default function (numbers) {
  // The Math.max retrun -Infinity when the second argument array is empty.
  const max = numbers.length === 0 ? 0 : Math.max(...numbers)
  return max + 1
}
