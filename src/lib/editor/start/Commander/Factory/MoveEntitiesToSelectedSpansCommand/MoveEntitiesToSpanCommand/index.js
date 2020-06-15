import AnnotationCommand from '../../AnnotationCommand'
import commandLog from '../../commandLog'
import RevertMoveEntitiesCommand from './RevertMoveEntitiesCommand'

export default class extends AnnotationCommand {
  constructor(annotationData, spanId, entities) {
    super()

    this._annotationData = annotationData
    this._spanId = spanId
    this._entities = entities
  }

  execute() {
    // Save move map to revert this command.
    this._moveMap = this._entities.reduce((map, entity) => {
      if (map.has(entity.span)) {
        map.get(entity.span).push(entity)
      } else {
        map.set(entity.span, [entity])
      }
      return map
    }, new Map())

    const message = `move entities: ${Array.from(this._moveMap.entries())
      .map(([_, entities]) => {
        return `${entities.map((e) => e.id).join(', ')} from ${
          entities[0].span
        } to ${this._spanId}`
      })
      .join(', ')}`

    this._annotationData.entity.moveEntities(this._spanId, this._entities)

    commandLog(message)
  }

  revert() {
    return new RevertMoveEntitiesCommand(this._annotationData, this._moveMap)
  }
}
