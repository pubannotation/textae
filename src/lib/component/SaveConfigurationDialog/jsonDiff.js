import { create } from 'jsondiffpatch'
import { format } from 'jsondiffpatch/formatters/html'

const jsond = create({
  objectHash(obj, index) {
    return obj.id || `$$index:${index}`
  }
})

export default function (originalConfig, editedConfig) {
  const delta = jsond.diff(originalConfig, editedConfig)
  return format(delta, originalConfig)
}
