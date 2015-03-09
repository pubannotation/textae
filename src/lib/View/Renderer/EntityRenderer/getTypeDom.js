import idFactory from '../../../util/idFactory';

export default function(spanId, type) {
    return $('#' + idFactory.makeTypeId(spanId, type));
}
