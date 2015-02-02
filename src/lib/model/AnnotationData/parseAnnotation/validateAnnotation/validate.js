var Result = function(reject) {
        return {
            accept: [],
            reject: reject ? reject : []
        };
    },
    partial = function(func, args) {
        if (args.length === 0) return func;
        if (args.length === 1) return _.partial(func, args[0]);
        if (args.length === 2) return _.partial(func, args[0], args[1]);
    },
    accept = function(predicate, result, target) {
        if (
            predicate(target)
        ) {
            result.accept.push(target);
        } else {
            result.reject.push(target);
        }

        return result;
    },
    validate = function(values, predicate) {
        if (!values) return new Result();

        predicate = partial(predicate, _.rest(arguments, 2));

        return values
            .reduce(
                _.partial(accept, predicate),
                new Result()
            );
    };

module.exports = validate;
