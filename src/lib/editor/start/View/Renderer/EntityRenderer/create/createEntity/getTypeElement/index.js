import getTypeDom from '../../../../getTypeDom'
import createEmptyTypeHtml from './createEmptyTypeHtml'
import getGrid from './getGrid'

// render type unless exists.
export default function(namespace, typeDefinition, gridRenderer, entity) {
  const dom = getTypeDom(entity)

  if (dom) {
    return dom
  }

  getGrid(gridRenderer, entity.span).insertAdjacentHTML(
    'beforeend',
    createEmptyTypeHtml(entity, namespace, typeDefinition)
  )

  return getTypeDom(entity)
}
