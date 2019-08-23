const publicApis = ['set', 'get', 'has', 'keys', 'delete', 'clear']

export default function() {
  const m = new Map()
  const api = publicApis.reduce((api, name) => {
    api[name] = Map.prototype[name].bind(m)
    return api
  }, {})

  return api
}
