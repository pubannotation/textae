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

  if (attributeDom) {
    attributeDom.setAttribute('title', `pred: ${attribute.pred}, value: ${attribute.value}`)
    attributeDom.firstElementChild.innerText = attribute.value
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
