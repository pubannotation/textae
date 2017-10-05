import create from './create'
import createAttributePopupEditorElement from './createAttributePopupEditorElement'

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
    change: (attribute) => changeAttributeElement(editor, typeContainer, attribute),
    changeModification: () => {},
    remove: (attribute) => removeAttributeElement(editor, attribute),
    updateLabel: () => {}
  }
}

function changeAttributeElement(editor, typeContainer, attribute) {
  const attributeDom = getAttributeDom(editor[0], attribute.id)

  if (attributeDom) {
    attributeDom.setAttribute('type', attribute.type)
    attributeDom.setAttribute('pred', attribute.pred)
    attributeDom.innerText = attribute.type
    attributeDom.appendChild(createAttributePopupEditorElement(editor, typeContainer, attribute))
  }

  return null
}

function removeAttributeElement(editor, attribute) {
  const attributeDom = getAttributeDom(editor[0], attribute.id)

  if (attributeDom) {
    attributeDom.remove()
  }

  return null
}

function getAttributeDom(editor, attributeId) {
  return editor.querySelector(`[title="${attributeId}"]`)
}
