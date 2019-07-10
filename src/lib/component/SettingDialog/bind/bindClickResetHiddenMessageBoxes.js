export default function($content, editor) {
  const onClickResetHiddenMessageBoxes = () => {
    editor.eventEmitter.emit('textae.message-box.show')
  }

  return $content.on('click', '.reset-hidden-message-boxes', onClickResetHiddenMessageBoxes)
}
