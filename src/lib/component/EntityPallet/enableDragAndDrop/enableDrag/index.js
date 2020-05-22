import showDropTargets from './showDropTargets'
import hideDropTargets from './hideDropTargets'

export default function(el) {
  for (const attributeTab of el.querySelectorAll(
    '.textae-editor__type-pallet__attribute'
  )) {
    // Stop event propagation to prevent the jQueryUI.dragging widget
    // from disabling the default handling of mousedown events.
    attributeTab.addEventListener('mousedown', (e) => {
      e.stopPropagation()
    })

    attributeTab.addEventListener('dragstart', (e) => {
      e.dataTransfer.setData('oldIndex', e.target.dataset.index)
      showDropTargets(e)
    })

    attributeTab.addEventListener('dragend', (e) => {
      e.dataTransfer.setData('oldIndex', e.target.dataset.index)
      hideDropTargets(e)
    })
  }
}
