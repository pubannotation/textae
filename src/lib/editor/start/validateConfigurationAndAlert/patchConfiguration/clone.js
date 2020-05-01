export default function(config) {
  return JSON.parse(JSON.stringify(config || {}))
}
