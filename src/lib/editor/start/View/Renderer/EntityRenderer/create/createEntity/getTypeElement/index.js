import getTypeDom from '../../../../getTypeDom'
import createEmptyTypeHtml from './createEmptyTypeHtml'
import getGrid from './getGrid'

// render type unless exists.
export default function(namespace, typeDefinition, gridRenderer, spanId, type) {
  const dom = getTypeDom(spanId, type)

  if (dom) {
    return dom
  }

  getGrid(gridRenderer, spanId).insertAdjacentHTML('beforeend', createEmptyTypeHtml(spanId, namespace, typeDefinition, type))

  return getTypeDom(spanId, type)
}
