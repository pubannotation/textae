import getGridOfSpan from './GridLayout/getGridOfSpan'

// an attribute height is 18px.
const attributeHeight = 18

export default function(spanId) {
  const grid = getGridOfSpan(spanId)

  if (grid) {
    // When displaying multiple "types", the previous "type" "attribute" overlaps with the next "type".
    // Only the last "type" "attribute" affects the height of the grid.
    return grid.querySelectorAll('.textae-editor__type:last-child .textae-editor__attribute')
      .length * attributeHeight
  }

  return 0
}
