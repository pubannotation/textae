import getTypeDom from '../../getTypeDom'
import createEmptyTypeDomElement from './createEmptyTypeDomElement'
import getGrid from './getGrid'

// render type unless exists.
export default function(namespace, typeContainer, gridRenderer, spanId, type) {
  let $type = getTypeDom(spanId, type)
  if ($type.length === 0) {
    $type = createEmptyTypeDomElement(namespace, typeContainer, spanId, type)
    getGrid(gridRenderer, spanId).appendChild($type[0])
  }

  return $type[0]
}


