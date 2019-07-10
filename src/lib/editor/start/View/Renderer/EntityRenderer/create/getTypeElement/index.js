import getTypeDom from '../../../getTypeDom'
import createEmptyTypeHtml from './createEmptyTypeHtml'
import getGrid from './getGrid'

// render type unless exists.
export default function(namespace, typeContainer, gridRenderer, spanId, type) {
  const $type = getTypeDom(spanId, type)

  if ($type.length !== 0) {
    return $type[0]
  }

  getGrid(gridRenderer, spanId).insertAdjacentHTML('beforeend', createEmptyTypeHtml(spanId, type))

  return getTypeDom(spanId, type)[0]
}
