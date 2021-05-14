export default function (editor) {
  editor.eventEmitter.on('textae-event.clip-board.change', (added, removed) => {
    for (const entity of added) {
      entity.startCut()
    }

    for (const entity of removed) {
      entity.cancelCut()
    }
  })
}
