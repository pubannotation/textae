import {LABEL_CLASS, ENTINY_CLASS} from "./const"
import selectLabelOfEntity from "./selectLabelOfEntity"
import selectSpanOfEntityLabel from "./selectSpanOfEntityLabel"
import selectSelected from "./selectSelected"

export default function(editorDom, selectionModel) {
  // When one entity label is selected.
  const labels = selectSelected(editorDom, LABEL_CLASS)

  if (labels.length === 1) {
    selectSpanOfEntityLabel(selectionModel, labels[0])
    return
  }

  // When one entity is selected.
  const selectedEnities = selectSelected(editorDom, ENTINY_CLASS)

  if (selectedEnities.length === 1) {
    selectLabelOfEntity(selectionModel, selectedEnities[0])
    return
  }
}
