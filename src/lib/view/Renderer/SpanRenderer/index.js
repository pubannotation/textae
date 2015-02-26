import create from './create';
import destroy from './destroy';
import renderClassOfSpan from './renderClassOfSpan';

export default function(model, isBlockFunc, renderEntityFunc) {
    return {
        render: span => create(
            span,
            model.annotationData,
            isBlockFunc,
            renderEntityFunc
        ),
        remove: span => destroy(span.id),
        change: span => renderClassOfSpan(span, isBlockFunc)
    };
}
