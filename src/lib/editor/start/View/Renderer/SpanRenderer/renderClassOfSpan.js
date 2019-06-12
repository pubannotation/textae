import not from 'not'

const BLOCK = 'textae-editor__span--block'
const WRAP = 'textae-editor__span--wrap'

export default function(span, isBlockFunc) {
  const el = document.querySelector(`#${span.id}`)

  // Set block class if there is any block type.
  if (any(span, isBlockFunc)) {
    el.classList.add(BLOCK)

    // The text of span can be wrapped because block type does not display Grid.
    // Set wrap class unless there is any type other than block.
    if (!any(span, not(isBlockFunc))) {
      el.classList.add(WRAP)
    } else {
      // Grid can not be folded.
      // When the text of span is folded, the positions of Grid and Span are separated.
      // Prevent text wrap if there is any type other than block and its Grid.
      el.classList.remove(WRAP)
    }
  } else {
    el.classList.remove(BLOCK)
  }
}

function any(span, isBlockFunc) {
  return span
    .getTypes()
    .map(type => type.name)
    .filter(isBlockFunc)
    .length > 0
}
