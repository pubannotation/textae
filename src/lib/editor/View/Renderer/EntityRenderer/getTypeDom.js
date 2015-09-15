import idFactory from '../../../idFactory';

export default function(spanId, type) {
  return $('#' + idFactory.makeTypeId(spanId, type));
}
