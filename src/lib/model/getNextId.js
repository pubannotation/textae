var hasPrefix = function(prefix, id) {
        return id[0] === prefix;
    },
    withoutPrefix = function(id) {
        return id.slice(1);
    },
    getNextId = function(prefix, existsIds) {
        var numbers = existsIds
            .filter(_.partial(hasPrefix, prefix))
            .map(withoutPrefix),
            // The Math.max retrun -Infinity when the second argument array is empty.
            max = numbers.length === 0 ? 0 : Math.max.apply(null, numbers),
            nextNumber = max + 1;

        return prefix + nextNumber;
    };

module.exports = getNextId;
