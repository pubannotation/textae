import CompositeCommand from './CompositeCommand'
import { CreateCommand } from './commandTemplate'

export default class AddAttributesToTheLatestEntityCommand extends CompositeCommand {
  constructor(editor, annotationData, attributes) {
    super()

    const subj = annotationData.entity.all.pop().id // Only one entity was created.

    this._subCommands = attributes.map(
      ({ obj, pred }) =>
        new CreateCommand(editor, annotationData, 'attribute', {
          subj,
          obj,
          pred
        })
    )

    this._logMessage = `create attributes ${attributes.map(
      ({ obj, pred }) => `obj:${obj} pred:${pred}`
    )} for entity ${subj}`
  }
}
