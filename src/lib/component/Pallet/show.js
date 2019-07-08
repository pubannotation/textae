import updateDisplay from './updateDisplay'
import setNotDefinedTypesToConfig from "./setNotDefinedTypesToConfig"

export default function(typeContainer, el, history, point, handlerType) {
  if (!typeContainer.isLock()) {
    setNotDefinedTypesToConfig(typeContainer)
  }

  updateDisplay(el, history, typeContainer, point, handlerType)
}
