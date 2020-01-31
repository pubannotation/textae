import capitalize from 'capitalize'

const SEED = {
  instanceHide: 0,
  instanceShow: 2
}

export default function() {
  const api = Object.assign({}, SEED)
  const set = (mode, val) => updateHash(api, mode, val)

  for (const key of Object.keys(SEED)) {
    api[`set${capitalize(key, true)}`] = (val) => set(key, val)
  }

  return api
}

function updateHash(hash, key, val) {
  hash[key] = val
  return val
}
