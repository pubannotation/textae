import SaveConfigurationDialog from '../../../component/SaveConfigurationDialog'

export default function(
  editor,
  dataAccessObject,
  currentConfig,
  orignalConfig
) {
  // Merge with the original config and save the value unchanged in the editor.
  const editidConfig = Object.assign({}, orignalConfig, currentConfig)

  new SaveConfigurationDialog(
    editor,
    dataAccessObject.configurationUrl,
    orignalConfig,
    editidConfig
  ).open()
}
