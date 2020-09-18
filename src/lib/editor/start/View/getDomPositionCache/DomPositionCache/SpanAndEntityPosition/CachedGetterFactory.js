import LesserMap from '../LesserMap'

export default function() {
  const factory = (getter) => {
    const map = new LesserMap()

    const func = (id) => {
      if (!map.has(id)) {
        map.set(id, getter(id))
      }

      return map.get(id)
    }

    func.clear = () => {
      map.clear()
    }

    return func
  }

  return factory
}
