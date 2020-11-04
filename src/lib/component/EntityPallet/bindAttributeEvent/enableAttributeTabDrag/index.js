import delegate from 'delegate'
import showDropTargets from './showDropTargets'
import hideDropTargets from './hideDropTargets'

export default function (el) {
  delegate(el, '.textae-editor__type-pallet__attribute', 'dragstart', (e) => {
    e.dataTransfer.setData(
      'application/x-textae-attribute-tab-old-index',
      e.target.dataset.index
    )
    showDropTargets(e)
  })

  delegate(el, '.textae-editor__type-pallet__attribute', 'dragend', (e) => {
    hideDropTargets(e)
  })
}
