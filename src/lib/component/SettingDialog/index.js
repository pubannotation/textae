import delegate from 'delegate'
import Dialog from '../Dialog'
import reflectImmediately from './reflectImmediately'
import packageJson from '../../../../package.json'
import template from './template'

export default class SettingDialog extends Dialog {
  constructor(
    typeDictionary,
    typeGap,
    textBox,
    configuration,
    spanConfig,
    functionAvailability
  ) {
    const contentHtml = template({
      typeGapDisabled: !typeGap.show,
      typeGap: typeGap.value,
      lineHeight: textBox.lineHeight,
      autocompletionWs: typeDictionary.autocompletionWs,
      typeDictionaryLocked: typeDictionary.isLock,
      autosave: configuration.autosave,
      autoLineheight: configuration.autolineheight,
      boundaryDetection: configuration.boundarydetection,
      delimiterCharacters: spanConfig.delimiterCharacters,
      blankCharacters: spanConfig.blankCharacters,
      functionAvailability,
      version: packageJson.version
    })

    super('Setting', contentHtml)

    // Reflects configuration changes in real time.
    reflectImmediately(super.el, typeGap, typeDictionary, textBox)

    // Add delimiter/non-edge character when "+" button click.
    delegate(
      super.el,
      `.textae-editor__setting-dialog__character-add`,
      'click',
      ({ target }) => {
        const targetRow = target.closest('tr')
        const input = targetRow.querySelector('input')
        const newValue = input.value
        if (newValue) {
          const newRow = document.createElement('tr')
          newRow.innerHTML = `
          <td><input style="width: 100%;" type="text" value="${newValue}"></td>
          <td><button class="textae-editor__setting-dialog__character-delete">&times;</button></td>
        `

          // Add newRow to above + button
          targetRow.parentElement.insertBefore(newRow, targetRow)

          // Clear input
          input.value = ''
        }
      }
    )

    // Delete delimiter/non-edge character when "x" button click.
    delegate(
      super.el,
      `.textae-editor__setting-dialog__character-delete`,
      'click',
      ({ target }) => {
        target.closest('tr').remove()
      }
    )

    // Observe enter key press
    delegate(super.el, `.textae-editor__dialog`, 'keyup', (e) => {
      if (e.keyCode === 13) {
        super.close()
      }
    })
  }
}
