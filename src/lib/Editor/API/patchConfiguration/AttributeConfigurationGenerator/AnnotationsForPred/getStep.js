// The value of step is matched to the smallest digit of all objcts.
export default function (objects) {
  const numberOfDigits = Math.max(
    ...objects.map((o) => {
      const [_, smallNumber] = String(o).split('.')
      return smallNumber ? smallNumber.length : 0
    })
  )

  // The step is a small number of the specified number of digits, with the lowest digit being 1.
  return Number(
    Array.from(Array(numberOfDigits))
      .reduce((acc, _) => acc * 0.1, 1)
      .toFixed(numberOfDigits)
  )
}
