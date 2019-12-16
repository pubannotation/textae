export default function(editors, selected) {
  for (const editor of editors) {
    editor.api.unselect()
  }
  selected.api.select()
}
