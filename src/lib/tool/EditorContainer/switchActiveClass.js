import removeAciteveClass from './removeAciteveClass'

export default function(editors, selected) {
  removeAciteveClass(editors)
  // Add ACTIVE_CLASS to the selected.
  selected[0].classList.add('textae-editor--active')
}
