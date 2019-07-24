import capitalize from 'capitalize'
import _ from 'underscore'

const SEED = {
  instanceHide: 0,
  instanceShow: 2
}

export default function() {
  const api = Object.assign({}, SEED)
  const set = (mode, val) => updateHash(api, mode, val)

  _.each(SEED, (val, key) => {
    api[`set${capitalize(key)}`] = (val) => set(key, val)
  })

  return api
}

function updateHash(hash, key, val) {
  hash[key] = val
  return val
}
