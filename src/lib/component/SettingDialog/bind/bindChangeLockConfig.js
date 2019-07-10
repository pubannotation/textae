import debounce300 from "./debounce300"

export default function bindChangeLockConfig($content, editor, typeContainer) {
  const onChangeLockConfig = debounce300((e) => {
    if (e.target.checked) {
      typeContainer.lockEdit()
    } else {
      typeContainer.unlockEdit()
    }
  })

  return $content.on('change', '.lock-config', onChangeLockConfig)
}
