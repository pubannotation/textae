export default function(prefix, existsIds) {
    let numbers = existsIds
        .filter(id => hasPrefix(prefix, id))
        .map(withoutPrefix),
        // The Math.max retrun -Infinity when the second argument array is empty.
        max = numbers.length === 0 ? 0 : Math.max.apply(null, numbers),
        nextNumber = max + 1;

    return prefix + nextNumber;
}

function hasPrefix(prefix, id) {
    // Exclude an id have other than prefix and number, for example 'T1a'.
    let reg = new RegExp(`${prefix}\\d+$`);

    return reg.test(id);
}

function withoutPrefix(id) {
    return id.slice(1);
}
