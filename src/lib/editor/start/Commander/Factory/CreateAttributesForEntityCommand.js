import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'

export default class extends CompositeCommand {
  constructor(editor, annotationData, selectionModel, attributes, entity) {
    super()

    this._subCommands = attributes.map(
      ({ obj, pred }) =>
        new CreateCommand(
          editor,
          annotationData,
          selectionModel,
          'attribute',
          false,
          {
            subj: entity,
            obj,
            pred
          }
        )
    )

    this._logMessage = `create attributes ${attributes.map(
      ({ obj, pred }) => `obj:${obj} pred:${pred}`
    )} for entity ${entity}`
  }
}
