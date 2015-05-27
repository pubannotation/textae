module.exports = function(modeAccordingToButton, editMode) {
    return {
        toggleDetectBoundaryMode: function() {
            modeAccordingToButton['boundary-detection'].toggle();
        },
        toggleRelationEditMode: function() {
            if (modeAccordingToButton['relation-edit-mode'].value()) {
                if (editMode.editable) {
                    editMode.toInstance();
                } else {
                    editMode.toViewInstance();
                }
            } else {
                editMode.toRelation();
            }
        }
    };
};
