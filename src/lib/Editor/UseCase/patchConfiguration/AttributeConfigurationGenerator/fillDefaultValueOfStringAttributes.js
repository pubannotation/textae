import clone from '../clone'

export default function (config) {
  config = clone(config)

  for (const a of config.filter((a) => a['value type'] === 'string')) {
    if (!Object.prototype.hasOwnProperty.call(a, 'default')) {
      a.default = ''
    }
  }

  return config
}
