import LesserMap from '../LesserMap'

export default function() {
  const factory = (getter) => {
    const map = new LesserMap()

    const func = (id) => getFromCache(map, getter, id)

    func.clear = () => {
      map.clear()
    }

    return func
  }

  return factory
}

function getFromCache(cache, getter, id) {
  if (!cache.has(id)) {
    cache.set(id, getter(id))
  }

  return cache.get(id)
}
