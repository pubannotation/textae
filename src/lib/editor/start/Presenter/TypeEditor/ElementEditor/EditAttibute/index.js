export default function(editor, annotationData, selectionModel, command, typeContainer, cancelSelect) {
  const init = () => {
    editor
      .on('click', '.textae-editor__attribute-button--delete', (e) => deleteButtonClicked(annotationData, selectionModel, command, e))
  }

  return {
    init,
    handlers: {}
  }
}

function deleteButtonClicked(annotationData, selectionModel, command, e) {
  let attributeId = getAttributeIdByClickedButton(e),
    attribute = annotationData.attribute.get(attributeId)

  command.invoke([command.factory.attributeRemoveCommand(attributeId)])
  selectionModel.attribute.remove(attributeId)
}

function getAttributeIdByClickedButton(e) {
  return e.target.parentNode.parentNode.getAttribute('title')
}
