import CachedGetterFactory from './CachedGetterFactory'
import getEntityDom from '../../getEntityDom'

const factory = new CachedGetterFactory()

export default function(editor, entityModel, gridPositionCache) {
  // The cache for span positions.
  // Getting the postion of spans is too slow about 5-10 ms per a element in Chrome browser. For example offsetTop property.
  // This cache is big effective for the initiation, and little effective for resize.
  const cachedGetSpan = factory((spanId) => getSpan(editor, spanId))
  const cachedGetEntity = factory((entityId) =>
    getEntity(editor, entityModel, gridPositionCache, entityId)
  )

  return {
    reset: factory.clearAllCache,
    getSpan: cachedGetSpan,
    getEntity: cachedGetEntity
  }
}

function getSpan(editor, spanId) {
  const span = editor[0].querySelector(`#${spanId}`)
  if (!span) {
    throw new Error(`span is not renderd : ${spanId}`)
  }

  // An element.offsetTop and element.offsetLeft does not work in the Firefox,
  // when much spans are loaded like http://pubannotation.org/docs/sourcedb/PMC/sourceid/1315279/divs/10/annotations.json.
  const spanBox = span.getBoundingClientRect()
  const textBox = span.offsetParent.offsetParent.getBoundingClientRect()

  return {
    top: spanBox.top - textBox.top,
    left: spanBox.left - textBox.left,
    width: span.offsetWidth,
    height: span.offsetHeight,
    center: span.offsetLeft + span.offsetWidth / 2
  }
}

function getEntity(editor, entityModel, gridPositionCache, entityId) {
  const entity = getEntityDom(editor[0], entityId)
  if (!entity) {
    throw new Error(`entity is not rendered : ${entityId}`)
  }

  const spanId = entityModel.get(entityId).span
  const gridPosition = gridPositionCache.get(spanId)

  return {
    top: gridPosition.top + entity.offsetTop,
    center: gridPosition.left + entity.offsetLeft + entity.offsetWidth / 2
  }
}
