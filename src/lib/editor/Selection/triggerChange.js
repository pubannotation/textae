export default function(emitter, kindName) {
  emitter.emit(`textae.selection.${kindName}.change`)
}
