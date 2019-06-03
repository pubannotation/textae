// an attribute height is 18px.
const attributeHeight = 18

export default function(types) {
  // When displaying multiple "types", the previous "type" "attribute" overlaps with the next "type".
  // Only the last "type" "attribute" affects the height of the grid.
  const lastType = types[types.length - 1]

  if (lastType) {
    return lastType.attributes.length * attributeHeight
  }

  return 0
}
