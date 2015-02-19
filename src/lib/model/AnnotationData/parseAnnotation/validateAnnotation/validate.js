import Reject from '../../../../Reject';

export default function(values, predicate, predicateOption) {
    if (!values) return new Reject();

    predicate = partial(predicate, predicateOption);

    return values
        .reduce(
            _.partial(acceptIf, predicate),
            new Reject()
        );
}

function partial(func, opt) {
    if (!opt) return func;

    return _.partial(func, opt);
}

function acceptIf(predicate, result, target) {
    if (
        predicate(target)
    ) {
        result.accept.push(target);
    } else {
        result.reject.push(target);
    }

    return result;
}
