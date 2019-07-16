import toData from "./toData"
export default function(emitter, buttons) {
  buttons
    .map(toData)
    .forEach((data) => emitter.emit('change', data))
}
