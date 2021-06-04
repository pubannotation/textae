export default function (el) {
  for (const attributeTab of el.querySelectorAll(
    '.textae-editor__type-pallet__attribute'
  )) {
    attributeTab.addEventListener('mousedown', (e) => {
      // Stop event propagation to prevent the jQueryUI.dragging widget
      // from disabling the default handling of mousedown events.
      e.stopPropagation()
    })
  }
}
