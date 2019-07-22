import create from './create'

export default function(editor) {
  return {
    render: (attribute) => {
      create(
        editor,
        attribute
      )
    },
    change: (attribute) => changeAttributeElement(editor, attribute),
    changeModification: () => { },
    remove: (attribute) => removeAttributeElement(editor, attribute),
    updateLabel: () => { }
  }
}

function changeAttributeElement(editor, attribute) {
  const attributeDom = getAttributeDom(editor[0], attribute.id)
  const renderData = attribute.getDataToRender(attributeDom.closest('.textae-editor__type').id)

  if (attributeDom) {
    attributeDom.setAttribute('title', renderData.title)
    attributeDom.firstElementChild.innerText = renderData.obj
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
  return editor.querySelector(`[data-attribute-id="${attributeId}"]`)
}
