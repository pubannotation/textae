export default function(editor, connect) {
  connect.addClass('ui-selected')
  // Before creation of e a relation the souce entity is selected. And that entity is deselected at that relation creation.
  // When entities or spans is deselected thier HTML element is blured.
  // Focus the editor manually to prevent the editor lose focus and lose capability of keyboard shortcut.
  editor.focus()
}
