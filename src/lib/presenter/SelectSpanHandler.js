module.exports = function(annotationData, selectionModel) {
    return {
        selectLeftSpan: function() {
            var spanId = selectionModel.span.single();
            if (spanId) {
                var span = annotationData.span.get(spanId);
                selectionModel.clear();
                if (span.left) {
                    selectionModel.span.add(span.left.id);
                }
            }
        },
        selectRightSpan: function() {
            var spanId = selectionModel.span.single();
            if (spanId) {
                var span = annotationData.span.get(spanId);
                selectionModel.clear();
                if (span.right) {
                    selectionModel.span.add(span.right.id);
                }
            }
        }
    };
};
