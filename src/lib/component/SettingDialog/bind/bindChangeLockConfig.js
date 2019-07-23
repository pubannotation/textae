import debounce300 from "./debounce300"

export default function($content, typeDefinition) {
  const onChangeLockConfig = debounce300((e) => {
    if (e.target.checked) {
      typeDefinition.lockEdit()
    } else {
      typeDefinition.unlockEdit()
    }
  })

  return $content.on('change', '.lock-config', onChangeLockConfig)
}
