export default function (config) {
  return config.filter((a) => a['value type'] === 'selection')
}
