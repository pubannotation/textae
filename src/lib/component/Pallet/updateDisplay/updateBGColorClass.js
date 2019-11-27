export default function(pallet, handlerType) {
  if (handlerType === 'entity') {
    pallet.classList.remove('textae-editor__type-pallet--relation')
    pallet.classList.add('textae-editor__type-pallet--entity')
  } else if (handlerType === 'relation') {
    pallet.classList.add('textae-editor__type-pallet--relation')
    pallet.classList.remove('textae-editor__type-pallet--entity')
  }
}
