import { create, formatters } from 'jsondiffpatch'

const jsond = create({
  objectHash(obj, index) {
    return obj.id || `$$index:${index}`
  }
})

export default function(originalConfig, editedConfig) {
  const delta = jsond.diff(originalConfig, editedConfig)
  return formatters.html.format(delta, originalConfig)
}
