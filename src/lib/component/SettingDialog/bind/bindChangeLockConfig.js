import debounce300 from "./debounce300"

export default function bindChangeLockConfig($content, editor, typeDefinition) {
  const onChangeLockConfig = debounce300((e) => {
    if (e.target.checked) {
      typeDefinition.lockEdit()
    } else {
      typeDefinition.unlockEdit()
    }
  })

  return $content.on('change', '.lock-config', onChangeLockConfig)
}
