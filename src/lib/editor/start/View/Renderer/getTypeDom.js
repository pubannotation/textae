import idFactory from '../../../idFactory'
import $ from 'jquery'

export default function(spanId, type) {
  return $('#' + idFactory.makeTypeId(spanId, type))
}
