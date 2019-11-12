const BLOCK = 'textae-editor__span--block'
const WRAP = 'textae-editor__span--wrap'

export default function(annotationData, span) {
  const el = document.querySelector(`#${span.id}`)

  // Set block class if there is any block type.
  if (span.types.some((type) => type.isBlock)) {
    el.classList.add(BLOCK)

    // The text of span can be wrapped because block type does not display Grid.
    // Set wrap class unless there is any type other than block.
    if (span.types.every((type) => type.isBlock)) {
      el.classList.add(WRAP)
    } else {
      // Grid can not be folded.
      // When the text of span is folded, the positions of Grid and Span are separated.
      // Prevent text wrap if there is any type other than block and its Grid.
      el.classList.remove(WRAP)
    }
  } else {
    el.classList.remove(BLOCK)
    el.classList.remove(WRAP)
  }
}
