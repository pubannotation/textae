import LesserMap from '../LesserMap'

export default function() {
  const caches = []
  const factory = (getter) => create(caches, getter)

  factory.clearAllCache = () => clearAll(caches)
  return factory
}

function create(caches, getter) {
  const map = new LesserMap()

  caches.push(map)

  return (id) => getFromCache(map, getter, id)
}

function getFromCache(cache, getter, id) {
  if (!cache.has(id)) {
    cache.set(id, getter(id))
  }

  return cache.get(id)
}

function clearAll(caches) {
  caches.forEach((cache) => cache.clear())
}
