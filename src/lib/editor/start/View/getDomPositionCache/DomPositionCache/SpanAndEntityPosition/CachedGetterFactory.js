import LesserMap from '../LesserMap'

export default function() {
  const caches = []
  const factory = (getter) => {
    const map = new LesserMap()

    caches.push(map)

    return (id) => getFromCache(map, getter, id)
  }

  factory.clearAllCache = () => {
    caches.forEach((cache) => cache.clear())
  }

  return factory
}

function getFromCache(cache, getter, id) {
  if (!cache.has(id)) {
    cache.set(id, getter(id))
  }

  return cache.get(id)
}
