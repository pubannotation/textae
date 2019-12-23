export default function(editors, selected) {
  for (const editor of editors) {
    // Do not deselect the selected editor.
    // Otherwise, it will be deselected once when you reselect the currently selected editor and close the palette.
    if (editor !== selected) {
      editor.api.unselect()
    }
  }
  selected.api.select()
}
