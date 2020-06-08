import toData from './toData'

export default function(emitter, buttons) {
  for (const button of buttons.values()) {
    emitter.emit('textae.control.button.push', toData(button))
  }
}
