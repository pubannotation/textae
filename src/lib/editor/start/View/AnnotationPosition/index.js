import { EventEmitter } from 'events'
import GridLayout from './GridLayout'

export default class extends EventEmitter {
  constructor(editor, annotationData, typeDefinition) {
    super()
    this.gridLayout = new GridLayout(editor, annotationData, typeDefinition)
  }

  update(typeGap) {
    super.emit('position-update.start')

    this.gridLayout.arrangePosition(typeGap)
    super.emit('position-update.grid.end', () =>
      super.emit('position-update.end')
    )
  }

  updateAsync(typeGap) {
    super.emit('position-update.start')

    this.gridLayout
      .arrangePositionAsync(typeGap)
      .then(() =>
        super.emit('position-update.grid.end', () =>
          super.emit('position-update.end')
        )
      )
      .catch((error) => console.error(error, error.stack))
  }
}
