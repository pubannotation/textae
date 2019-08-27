import CompositeCommand from './CompositeCommand'
import getSpecificModification from './getSpecificModification'
import { RemoveCommand } from './commandTemplate'

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
      .map(
        (id) => getSpecificModification(annotationData, id, modificationType)[0]
      )
      .map(
        (m) =>
          new RemoveCommand(
            editor,
            annotationData,
            selectionModel,
            'modification',
            m.id
          )
      )
    this._logMessage = `remove a modification ${modificationType} from ${targets}`
  }
}
