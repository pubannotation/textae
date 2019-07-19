import idFactory from '../../../idFactory'

export default function(entity) {
  return document.querySelector(`#${idFactory.makeTypeId(entity)}`)
}
