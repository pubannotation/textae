module.exports = function(annotationData, selectionModel) {
    return {
        selectLeftSpan: function() {
            var spanId = selectionModel.span.single();
            if (spanId) {
                var span = annotationData.span.get(spanId);
                if (span.left) {
                    selectionModel.clear();
                    selectionModel.span.add(span.left.id);
                }
            }
        },
        selectRightSpan: function() {
            var spanId = selectionModel.span.single();
            if (spanId) {
                var span = annotationData.span.get(spanId);
                if (span.right) {
                    selectionModel.clear();
                    selectionModel.span.add(span.right.id);
                }
            }
        }
    };
};
