import CompositeCommand from './CompositeCommand'
import getSpecificModification from './getSpecificModification'
import { CreateCommand } from './commandTemplate'

export default class extends CompositeCommand {
  constructor(
    editor,
    annotationData,
    selectionModel,
    modificationType,
    typeEditor
  ) {
    super()

    const targets = typeEditor.getSelectedIdEditable()

    this._subCommands = targets
      .filter(
        (id) =>
          !getSpecificModification(annotationData, id, modificationType)
            .length > 0
      )
      .map(
        (id) =>
          new CreateCommand(
            editor,
            annotationData,
            selectionModel,
            'modification',
            false,
            {
              obj: id,
              pred: modificationType
            }
          )
      )

    this._logMessage = `attach a modification to ${targets}`
  }
}
