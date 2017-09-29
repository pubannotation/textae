import create from './create'

export default function(editor, annotationData, selectionModel, typeContainer, gridRenderer) {
  return {
    render: (attribute) => {
      create(
        editor,
        annotationData.namespace,
        typeContainer,
        gridRenderer,
        attribute
      )
    },
    change: () => {},
    changeModification: () => {},
    remove: (attribute) => destroy(
      editor,
      annotationData,
      gridRenderer,
      attribute
    ),
    updateLabel: () => {}
  }
}

function destroy(editor, annotationData, gridRenderer, attribute) {
  removeAttributeElement(editor, attribute.id)

  return attribute
}

function removeAttributeElement(editor, attributeId) {
  const attributeDom = getAttributeDom(editor[0], attributeId)

  if (attributeDom) {
    attributeDom.remove()
  }

  return null
}

function getAttributeDom(editor, attributeId) {
  return editor.querySelector(`[title="${attributeId}"]`)
}
