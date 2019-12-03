import CreateTypeDefinitionDialog from '../../../../../component/CreateTypeDefinitionDialog'
import EditTypeDefinitionDialog from '../../../../../component/EditTypeDefinitionDialog'

export default function bindPalletEvents(
  pallet,
  handler,
  autocompletionWs,
  editor,
  commander
) {
  pallet
    .on('textae.pallet.add-button.click', () => {
      new CreateTypeDefinitionDialog(
        handler.typeContainer,
        autocompletionWs,
        (newType) => handler.commander.invoke(handler.addType(newType))
      )
    })
    .on('textae.pallet.read-button.click', () =>
      editor.api.handlePalletClick('textae.pallet.button.read.click')
    )
    .on('textae.pallet.write-button.click', () =>
      editor.api.handlePalletClick('textae.pallet.button.write.click')
    )
    .on('textae.pallet.item.label.click', (typeName) =>
      commander.invoke(handler.changeTypeOfSelectedElement(typeName))
    )
    .on('textae.pallet.item.select-all-button.click', (typeName) =>
      handler.selectAll(typeName)
    )
    .on('textae.pallet.item.edit-button.click', (id, color, isDefault) => {
      new EditTypeDefinitionDialog(
        handler.typeContainer,
        id,
        color,
        isDefault,
        autocompletionWs,
        (changedProperties) => {
          if (changedProperties.size) {
            handler.commander.invoke(handler.changeType(id, changedProperties))
          }
        }
      )
    })
    .on('textae.pallet.item.remove-button.click', (id, label) => {
      // When the user clicks the delete button, the browser focuses on the delete button.
      // If you delete a line that contains a delete button with focus, the editor loses focus.
      // Keyboard shortcuts will not work if focus is lost from the editor.
      // To prevent this, focus on the editor before deleting the line.
      editor.focus()

      commander.invoke(handler.removeType(id, label))
    })
}
