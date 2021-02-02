const cssClass = 'ui-to-be-cut'

export default function (editor) {
  editor.eventEmitter.on('textae-event.clip-board.change', (added, removed) => {
    for (const entity of added) {
      if (entity.element) {
        entity.element.classList.add(cssClass)
      }
    }

    for (const entity of removed) {
      if (entity.element) {
        entity.element.classList.remove(cssClass)
      }
    }
  })
}
