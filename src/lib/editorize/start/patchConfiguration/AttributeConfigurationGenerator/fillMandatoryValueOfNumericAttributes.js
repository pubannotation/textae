import clone from '../clone'

export default function (config) {
  config = clone(config)

  for (const a of config.filter((a) => a['value type'] === 'numeric')) {
    if (!Object.prototype.hasOwnProperty.call(a, 'default')) {
      a.default = 0
    }
    if (!Object.prototype.hasOwnProperty.call(a, 'min')) {
      a.min = 0
    }
    if (!Object.prototype.hasOwnProperty.call(a, 'max')) {
      a.max = 0
    }
    if (!Object.prototype.hasOwnProperty.call(a, 'step')) {
      a.step = 0
    }
  }

  return config
}
