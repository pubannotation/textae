import Reject from '../../../../Reject';

export default function(values, predicate, predicateOption) {
    if (!values) return new Reject();

    return values
        .reduce(
            (result, target) => acceptIf(
                predicate,
                predicateOption,
                result,
                target
            ),
            new Reject()
        );
}

function acceptIf(predicate, predicateOption, result, target) {
    if (predicate(target, predicateOption)) {
        result.accept.push(target);
    } else {
        result.reject.push(target);
    }

    return result;
}
