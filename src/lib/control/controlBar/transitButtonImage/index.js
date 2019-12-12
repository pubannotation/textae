import transit from './transit'
import untransit from './untransit'

export default function(el, buttonList, transitButtons) {
  Object.keys(transitButtons)
    .filter((buttonType) => buttonList[buttonType])
    .forEach((buttonType) => {
      if (transitButtons[buttonType] === true) {
        transit(el, buttonType)
      } else {
        untransit(el, buttonType)
      }
    })
}
