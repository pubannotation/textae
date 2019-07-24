import {diff} from 'jsondiffpatch'
import formatters from 'jsondiffpatch/src/formatters'


export default function(originalConfig, editedConfig) {
  let delta = diff(originalConfig, editedConfig)
  return formatters.html.format(delta, originalConfig)
}
