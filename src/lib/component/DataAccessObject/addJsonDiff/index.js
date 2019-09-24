import jsonDiff from './jsonDiff'

export default function(el, originalConfig, editedConfig) {
  const diff = jsonDiff(originalConfig, editedConfig) || 'nothing.'
  el.insertAdjacentHTML(
    'beforeend',
    `
    <div class="textae-editor__save-dialog__row"><p class="textae-editor__save-dialog__diff-title">Configuration differences<span class="diff-info diff-info--add">added</span><span class="diff-info diff-info--remove">removed</span></p></div>
    <div class="textae-editor__save-dialog__diff-viewer">${diff}</div>
    `
  )
}
