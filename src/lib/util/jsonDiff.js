export default function(originalConfig, editedConfig) {
   let delta = jsondiffpatch.diff(originalConfig, editedConfig)
  return jsondiffpatch.formatters.html.format(delta, originalConfig)
}
