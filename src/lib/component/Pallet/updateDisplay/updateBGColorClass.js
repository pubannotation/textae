import CLASS_NAMES from '../className'

export default function(pallet, handlerType) {
  if (handlerType === 'entity') {
    pallet.classList.remove(CLASS_NAMES.baseRelation)
    pallet.classList.add(CLASS_NAMES.baseEntity)
  } else if (handlerType === 'relation') {
    pallet.classList.add(CLASS_NAMES.baseRelation)
    pallet.classList.remove(CLASS_NAMES.baseEntity)
  }
}
