var setDefaultEditMode = function(editMode, isEditable, annotationData) {
        editMode.init(isEditable);

        // Change view mode accoding to the annotation data.
        if (annotationData.relation.some() || annotationData.span.multiEntities().length > 0) {
            editMode.toInstance();
        } else {
            editMode.toTerm();
        }
    };

module.exports = setDefaultEditMode;
