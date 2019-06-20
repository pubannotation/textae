
export default function(emitter, gridLayout, typeGap) {
  emitter.emit('position-update.start')

  gridLayout.arrangePosition(typeGap)
    .then(() => emitter.emit('position-update.grid.end', () => emitter.emit('position-update.end')))
    .catch((error) => console.error(error, error.stack))
}
