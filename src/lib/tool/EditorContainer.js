const ACTIVE_CLASS = 'textae-editor--active'

// The editor is extended jQuery object.
export default function() {
  let editorList = [],
    selected = null,
    select = (editorList, editor) => {
      switchActiveClass(editorList, editor)
      selected = editor
    }

  return {
    push: (editor) => editorList.push(editor),
    getNewId: () => 'editor' + editorList.length,
    getSelected: () => selected,
    select: (editor) => select(editorList, editor),
    forEach: editorList.forEach.bind(editorList)
  }
}

function switchActiveClass(editors, selected) {
  // Remove ACTIVE_CLASS from others than selected.
  editors
    .filter(editor => editor !== selected)
    .map(other => other[0])
    .forEach(elemet => {
      elemet.classList.remove(ACTIVE_CLASS)
    })

  // Add ACTIVE_CLASS to the selected.
  selected[0].classList.add(ACTIVE_CLASS)
}
