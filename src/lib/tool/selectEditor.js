export default function(editors, editor) {
  if (editor) {
    if (editors.selected && editor[0] !== editors.selected[0]) {
      editors.unselect(editors.selected)
    }
    editors.selected = editor
  }
}
