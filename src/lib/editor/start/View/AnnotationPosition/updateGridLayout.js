
export default function(emitter, editor, gridLayout, typeGap) {
  emitter.emit('position-update.start', editor)

  gridLayout.arrangePosition(typeGap)
    .then(() => emitter.emit('position-update.grid.end', () => {
      emitter.emit('position-update.end', editor)
    }))
    .catch((error) => console.error(error, error.stack))
}
