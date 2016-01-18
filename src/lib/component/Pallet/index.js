import Component from './Component'
import updateDisplay from './updateDisplay'

export default function(selectType, selectDefaultType) {
  let pallet = new Component(selectType, selectDefaultType)
  let $pallet = $(pallet)

  document.body.appendChild(pallet)

  return {
    show: (typeContainer, point) => updateDisplay(pallet, typeContainer, point),
    hide: () => pallet.style.display = 'none'
  }
}
