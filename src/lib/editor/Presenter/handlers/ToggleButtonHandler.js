export default function(modeAccordingToButton, editMode) {
    return {
        toggleDetectBoundaryMode: () => toggleDetectBoundaryMode(modeAccordingToButton),
        toggleRelationEditMode: () => toggleRelationEditMode(modeAccordingToButton, editMode)
    };
}

function toggleDetectBoundaryMode(modeAccordingToButton) {
    modeAccordingToButton['boundary-detection'].toggle();
}

function toggleRelationEditMode(modeAccordingToButton, editMode) {
    if (modeAccordingToButton['relation-edit-mode'].value()) {
        editMode.upRelation();
    } else {
        editMode.pushRelation();
    }
}
