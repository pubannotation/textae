import CLASS_NAMES from '../className'

export default function(pallet, handlerType) {
  const noConfigText = pallet.querySelector(`.${CLASS_NAMES.noConfig}`)

  if (noConfigText) {
    noConfigText.innerText = `There is no ${handlerType} definition.`
  }
}
