export default function(modeAccordingToButton, editMode) {
    return {
        toggleViewMode: () => toggleViewMode(modeAccordingToButton, editMode),
        toggleDetectBoundaryMode: () => toggleDetectBoundaryMode(modeAccordingToButton),
        toggleInstaceRelation: () => toggleInstaceRelation(editMode)
    };
}

function toggleViewMode(modeAccordingToButton, editMode) {
    if (modeAccordingToButton.view.value()) {
        editMode.upView();
    } else {
        editMode.pushView();
    }
}

function toggleDetectBoundaryMode(modeAccordingToButton) {
    modeAccordingToButton['boundary-detection'].toggle();
}

function toggleInstaceRelation(editMode) {
    editMode.toggleInstaceRelation();
}
