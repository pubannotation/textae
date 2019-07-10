import debounce300 from "./debounce300"

export default function bindChangeLockConfig($content, editor) {
  const onChangeLockConfig = debounce300((e) => {
    if (e.target.checked) {
      editor.eventEmitter.emit('textae.config.lock')
    } else {
      editor.eventEmitter.emit('textae.config.unlock')
    }
  })

  return $content.on('change', '.lock-config', onChangeLockConfig)
}
