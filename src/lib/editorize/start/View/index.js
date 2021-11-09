import debounce from 'debounce'
import LineHeightAuto from './LineHeightAuto'

export default class View {
  constructor(eventEmitter, annotationData) {
    this._annotationData = annotationData

    // Bind annotation data events
    const lineHeightAuto = new LineHeightAuto(
      eventEmitter,
      this._annotationData.textBox
    )
    const debouncedUpdatePosition = debounce(() => {
      lineHeightAuto.updateLineHeight()
      this._annotationData.updatePosition()
    }, 100)

    eventEmitter
      .on('textae-event.annotation-data.all.change', debouncedUpdatePosition)
      .on('textae-event.annotation-data.entity.add', () =>
        // If you delay the recalculation of the line height
        // when you create a new span and add entities,
        // the span will move after the scrolling by the span focus.
        // This may cause the span to move out of the display area.
        // Calculate the line height with as little delay as possible
        // and after rendering the entities.
        requestAnimationFrame(() => {
          lineHeightAuto.updateLineHeight()
          this._annotationData.updatePosition()
        })
      )
      .on('textae-event.annotation-data.entity.change', debouncedUpdatePosition)
      .on('textae-event.annotation-data.entity.remove', debouncedUpdatePosition)
      .on('textae-event.annotation-data.entity.move', debouncedUpdatePosition)
      .on('textae-event.annotation-data.relation.add', debouncedUpdatePosition)
      .on('textae-event.annotation-data.attribute.add', debouncedUpdatePosition)
      .on(
        'textae-event.annotation-data.attribute.change',
        debouncedUpdatePosition
      )
      .on(
        'textae-event.annotation-data.attribute.remove',
        debouncedUpdatePosition
      )
      .on('textae-event.annotation-data.span.move', debouncedUpdatePosition)
      .on('textae-event.annotation-data.entity-gap.change', () =>
        this._annotationData.updatePosition()
      )

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
    eventEmitter.on(
      'textae-event.commander.attributes.change',
      (attributes) => {
        for (const subjectModel of attributes.reduce(
          (prev, curr) => prev.add(curr.subjectModel),
          new Set()
        )) {
          subjectModel.updateElement()
        }
      }
    )

    // Bind type-definition events.
    eventEmitter
      .on('textae-event.type-definition.entity.change', (typeName) => {
        for (const entity of annotationData.entity.all) {
          // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
          if (
            entity.typeName === typeName ||
            (typeName.lastIndexOf('*') === typeName.length - 1 &&
              entity.typeName.indexOf(typeName.slice(0, -1) === 0))
          ) {
            entity.updateElement()
          }
        }
      })
      .on('textae-event.type-definition.attribute.change', (pred) =>
        annotationData.entity.redrawEntitiesWithSpecifiedAttribute(pred)
      )
      .on('textae-event.type-definition.attribute.move', (pred) =>
        annotationData.entity.redrawEntitiesWithSpecifiedAttribute(pred)
      )
      .on('textae-event.type-definition.relation.change', (typeName) => {
        for (const relation of annotationData.relation.all) {
          // If the type name ends in a wildcard, look for the DOMs to update with a forward match.
          if (
            relation.typeName === typeName ||
            (typeName.lastIndexOf('*') === typeName.length - 1 &&
              relation.typeName.indexOf(typeName.slice(0, -1) === 0))
          ) {
            relation.updateElement()
          }
        }
      })
  }

  updateDisplay() {
    this._annotationData.textBox.forceUpdate()
    this._annotationData.updatePosition()
  }

  updateLineHeight() {
    this._annotationData.textBox.updateLineHeight()
    this._annotationData.updatePosition()
  }
}
