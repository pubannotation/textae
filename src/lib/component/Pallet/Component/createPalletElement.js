const html = `
<div class="textae-editor__type-pallet">
  <p class="textae-editor__type-pallet__title">
    <span class="textae-editor__type-pallet__title-text">Entity configuration</span>
    <span class="textae-editor__type-pallet__lock-icon" style="display: none;">locked</span>
  </p>
  <div class="textae-editor__type-pallet__buttons textae-editor__type-pallet__hide-when-locked">
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__add-button" title="Add new type"></span>
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__read-button" title="Import"></span>
    <span class="textae-editor__type-pallet__button textae-editor__type-pallet__write-button" title="Upload"></span>
  </div>
  <table>
    <tbody>
    </tbody>
  </table>
</div>`

export default function() {
  const pallet = document.createElement('div')

  pallet.innerHTML = html
  return pallet.firstElementChild
}
