export default function(data, opt) {
    if (!opt.dictionary) return false;

    return opt.dictionary
        .filter(entry => entry.id === data[opt.property])
        .length === 1;
}
