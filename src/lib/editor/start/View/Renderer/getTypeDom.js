import idFactory from '../../../idFactory'

export default function(spanId, type) {
  return document.querySelector(`#${idFactory.makeTypeId(spanId, type)}`)
}
