import alertifyjs from 'alertifyjs'
import ValidationDialog from '../component/ValidationDialog'
import isAndroid from './isAndroid'

export default function (eventEmitter) {
  eventEmitter
    .on('textae-event.resource.annotation.format.error', ({ displayName }) =>
      alertifyjs.error(
        `${displayName} is not a annotation file or its format is invalid.`
      )
    )
    .on('textae-event.resource.configuration.format.error', ({ displayName }) =>
      alertifyjs.error(
        `${displayName} is not a configuration file or its format is invalid.!`
      )
    )
    .on('textae-event.annotation-data.all.change', (_, __, rejects) => {
      if (rejects.some((r) => r.hasError)) {
        new ValidationDialog(rejects).open()
      }
    })
    .on('textae-event.annotation-data.events-observer.change', (hasChange) => {
      // change leaveMessage show
      // Reloading when trying to scroll further when you are at the top on an Android device.
      // Show a confirmation dialog to prevent this.
      window.onbeforeunload = isAndroid() || hasChange ? () => true : null
    })

  // Bind clipBoard events.
  eventEmitter.on('textae-event.clip-board.change', (added, removed) => {
    for (const entity of added) {
      entity.startCut()
    }

    for (const entity of removed) {
      entity.cancelCut()
    }
  })

  // Bind commander events.
  // When you have an entity with multiple attributes whose pred is the same,
  // if you redraw the HTML element of the entity every time you update the attributes,
  // you need to consider the mixed state of the attributes after the update and before the update.
  // Redraw all the Entities that were affected at the end of the command.
  eventEmitter.on('textae-event.commander.attributes.change', (attributes) => {
    for (const subjectModel of attributes.reduce(
      (prev, curr) => prev.add(curr.subjectModel),
      new Set()
    )) {
      subjectModel.updateElement()
    }
  })
}
