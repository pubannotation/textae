// A span its range is coross over with other spans are not able to rendered.
// Because spans are renderd with span tag. Html tags can not be cross over.
module.exports = function(spans, candidateSpan) {
    return spans.filter(function(existSpan) {
        return (
                existSpan.begin < candidateSpan.begin &&
                candidateSpan.begin < existSpan.end &&
                existSpan.end < candidateSpan.end
            ) ||
            (
                candidateSpan.begin < existSpan.begin &&
                existSpan.begin < candidateSpan.end &&
                candidateSpan.end < existSpan.end
            );
    }).length > 0;
};
