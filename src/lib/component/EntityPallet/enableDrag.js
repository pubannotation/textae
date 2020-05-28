export default function(el, pallet) {
  for (const attributeTab of el.querySelectorAll(
    '.textae-editor__type-pallet__attribute'
  )) {
    attributeTab.addEventListener('mousedown', (e) => {
      // Stop event propagation to prevent the jQueryUI.dragging widget
      // from disabling the default handling of mousedown events.
      e.stopPropagation()

      // To start dragging and dropping smoothly,
      // select the tabs with the mouse down instead of clicking.
      // Otherwise, you have to release the mouse button once and then press the mouse button again to start dragging.
      pallet.showAttribute(e.target.dataset['attribute'])
    })
  }
}
