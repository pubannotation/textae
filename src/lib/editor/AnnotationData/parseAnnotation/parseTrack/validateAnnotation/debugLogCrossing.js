export default function (name, errors) {
  for (const [key, values] of errors.getInhibitors('isNotCrossing')) {
    console.warn(
      `Crossing ${name}: [${key.span.begin}:${key.span.end}](${
        key.id
      }) crosses with ${values
        .map(({ id, span }) => `[${span.begin}:${span.end}](${id})`)
        .join(', ')}`
    )
  }
}
