export default function(dataAccessObject, currentConfig, orignalConfig) {
  // Merge with the original config and save the value unchanged in the editor.
  const editidConfig = Object.assign({}, orignalConfig, currentConfig)

  dataAccessObject.showSaveConfiguration(orignalConfig, editidConfig)
}
