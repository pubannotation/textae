export default function(dataAccessObject, typeDefinition, getOriginalConfig) {
  const orignalConfig = getOriginalConfig()

  // Merge with the original config and save the value unchanged in the editor.
  const editidConfig = Object.assign(
    {},
    orignalConfig,
    typeDefinition.getConfig()
  )

  dataAccessObject.showSaveConf(orignalConfig, editidConfig)
}
