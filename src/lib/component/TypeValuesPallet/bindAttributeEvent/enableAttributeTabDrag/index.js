import delegate from 'delegate'

import hideDropTargets from './hideDropTargets'
import showDropTargets from './showDropTargets'

export default function (el) {
  delegate(el, '.textae-editor__pallet__attribute', 'dragstart', (e) => {
    e.dataTransfer.setData(
      'application/x-textae-attribute-tab-old-index',
      e.target.dataset.index
    )
    showDropTargets(e)
  })

  delegate(el, '.textae-editor__pallet__attribute', 'dragend', (e) => {
    hideDropTargets(e)
  })
}
