import toData from "./toData"

export default function(emitter, buttons) {
  for (const button of buttons.values()) {
    emitter.emit('change', toData(button))
  }
}
