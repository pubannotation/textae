import { create, formatters } from 'jsondiffpatch'

const jsond = create()

export default function(originalConfig, editedConfig) {
  const delta = jsond.diff(originalConfig, editedConfig)
  return formatters.html.format(delta, originalConfig)
}
