import Component from './Component'
import updateDisplay from './updateDisplay'

export default function(selectType, selectDefaultType) {
  let el = new Component(selectType, selectDefaultType)

  return {
    el,
    show: (typeContainer, point) => updateDisplay(el, typeContainer, point),
    hide: () => el.style.display = 'none'
  }
}
