export default function(pallet, editModeName) {
  if (editModeName === 'entity') {
    pallet.classList.remove('textae-editor__type-pallet--relation')
    pallet.classList.add('textae-editor__type-pallet--entity')
  } else if (editModeName === 'relation') {
    pallet.classList.add('textae-editor__type-pallet--relation')
    pallet.classList.remove('textae-editor__type-pallet--entity')
  }
}
