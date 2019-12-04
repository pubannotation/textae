export default function(editor) {
  const states = {}
  const mixin = {
    set(button, isTransit) {
      states[button] = isTransit
    },
    propagate() {
      editor.eventEmitter.emit('textae.control.buttons.transit', states)
    }
  }

  return mixin
}
