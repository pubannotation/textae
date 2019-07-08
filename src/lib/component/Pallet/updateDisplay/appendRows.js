import toRows from './toRows'

export default function(pallet, typeContainer) {
  pallet.querySelector('table').innerHTML = toRows(typeContainer)
}
