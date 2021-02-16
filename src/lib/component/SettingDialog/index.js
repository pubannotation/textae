import delegate from 'delegate'
import Dialog from '../Dialog'
import reflectImmediately from './reflectImmediately'
import packageJson from '../../../../package.json'

function template(context) {
  const {
    typeGap,
    typeGapDisabled,
    lineHeight,
    typeDefinitionLocked,
    version
  } = context

  return `
<div class="textae-editor__setting-dialog">
  <div>
    <label class="textae-editor__setting-dialog__label">Type Gap</label>
    <input 
      type="number" 
      class="textae-editor__setting-dialog__type-gap type-gap" 
      step="1" 
      min="0" 
      max="5" 
      value="${typeGap}" ${typeGapDisabled ? `disabled="disabled"` : ''}>
  </div>
  <div>
    <label class="textae-editor__setting-dialog__label">Line Height</label>
    <input 
      type="number" class="textae-editor__setting-dialog__line-height line-height" 
      step="1" 
      min="50" 
      max="500" 
      value="${lineHeight}">px
  </div>
  <div>
    <label class="textae-editor__setting-dialog__label">Lock Edit Config</label>
    <input 
      type="checkbox" 
      class="textae-editor__setting-dialog__lock-config lock-config"
      ${typeDefinitionLocked ? `checked="checked"` : ''}>
  </div>
  <div>
    <label class="textae-editor__setting-dialog__label">Reset Hidden Message Boxes</label>
    <input 
      type="button" 
      class="textae-editor__setting-dialog__reset-hidden-message-boxes reset-hidden-message-boxes" 
      value="Reset">
  </div>
  <div>
    <label class="textae-editor__setting-dialog__label">Version</label>
    ${version}
  </div>
</div>
`
}

export default class SettingDialog extends Dialog {
  constructor(editor, typeDefinition, entityGap, textBox) {
    const contentHtml = template({
      typeGapDisabled: !entityGap.show,
      typeGap: entityGap.value,
      lineHeight: textBox.lineHeight,
      typeDefinitionLocked: typeDefinition.isLock,
      version: packageJson.version
    })

    super('Setting', contentHtml, 'OK')

    // Reflects configuration changes in real time.
    reflectImmediately(super.el, editor, entityGap, typeDefinition, textBox)

    // Observe enter key press
    delegate(super.el, `.textae-editor__dialog`, 'keyup', (e) => {
      if (e.keyCode === 13) {
        super.close()
      }
    })
  }
}
