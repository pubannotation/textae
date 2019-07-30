import jsonDiff from '../../util/jsonDiff'

export default function(el, originalData, editedData) {
  const diff = jsonDiff(originalData.config, editedData.config) || 'nothing.'
  el.insertAdjacentHTML(
    'beforeend',
    `
    <div class="textae-editor__save-dialog__row"><p class="textae-editor__save-dialog__diff-title">Configuration differences<span class="diff-info diff-info--add">added</span><span class="diff-info diff-info--remove">removed</span></p></div>
    <div class="textae-editor__save-dialog__diff-viewer">${diff}</div>
    `
  )
}
