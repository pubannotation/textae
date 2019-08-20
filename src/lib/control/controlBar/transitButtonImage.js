import transit from '../transit'
import untransit from '../untransit'

export default function($control, buttonList, transitButtons) {
  Object.keys(transitButtons)
    .filter((buttonType) => buttonList[buttonType])
    .forEach((buttonType) => {
      if (transitButtons[buttonType] === true) {
        transit($control, buttonType)
      } else {
        untransit($control, buttonType)
      }
    })
}
