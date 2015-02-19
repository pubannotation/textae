import Reject from '../../../../Reject';

var partial = function(func, opt) {
        if (!opt) return func;

        return _.partial(func, opt);
    },
    acceptIf = function(predicate, result, target) {
        if (
            predicate(target)
        ) {
            result.accept.push(target);
        } else {
            result.reject.push(target);
        }

        return result;
    },
    validate = function(values, predicate, predicateOption) {
        if (!values) return new Reject();

        predicate = partial(predicate, predicateOption);

        return values
            .reduce(
                _.partial(acceptIf, predicate),
                new Reject()
            );
    };

module.exports = validate;
