import getTypeDom from '../../../getTypeDom'
import createEmptyTypeHtml from './createEmptyTypeHtml'
import getGrid from './getGrid'
import updateLabel from '../../updateLabel'

// render type unless exists.
export default function(namespace, typeContainer, gridRenderer, spanId, type) {
  const dom = getTypeDom(spanId, type)

  if (dom) {
    return dom
  }

  getGrid(gridRenderer, spanId).insertAdjacentHTML('beforeend', createEmptyTypeHtml(spanId, type))

  const newDom = getTypeDom(spanId, type)

  updateLabel(newDom.querySelector('.textae-editor__type-label'), namespace, typeContainer, type)

  return newDom
}
