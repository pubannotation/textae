import deleteButtonClicked from './deleteButtonClicked'
import addButtonClicked from './addButtonClicked'
import editButtonClicked from './editButtonClicked'

export default function(editor, annotationData, selectionModel, command, typeContainer) {
  editor
    .on('click', '.textae-editor__attribute-button--add', (e) => addButtonClicked(command, selectionModel, typeContainer, e))
    .on('click', '.textae-editor__attribute-button--edit', (e) => editButtonClicked(editor, annotationData, command, selectionModel, e))
    .on('click', '.textae-editor__attribute-button--delete', (e) => deleteButtonClicked(annotationData, selectionModel, command, e))
}
