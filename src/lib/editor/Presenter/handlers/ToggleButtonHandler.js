export default function(modeAccordingToButton, editMode) {
    return {
        toggleViewMode: () => toggleViewMode(modeAccordingToButton, editMode),
        toggleRelationMode: () => toggleRelationMode(modeAccordingToButton, editMode),
        toggleSimpleMode: () => toggleSimpleMode(modeAccordingToButton, editMode),
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

function toggleRelationMode(modeAccordingToButton, editMode) {
    if (modeAccordingToButton.relation.value()) {
        editMode.upRelation();
    } else {
        editMode.pushRelation();
    }
}

function toggleSimpleMode(modeAccordingToButton, editMode) {
    if (modeAccordingToButton.simple.value()) {
        editMode.upSimple();
    } else {
        editMode.pushSimple();
    }
}

function toggleDetectBoundaryMode(modeAccordingToButton) {
    modeAccordingToButton['boundary-detection'].toggle();
}

function toggleInstaceRelation(editMode) {
    editMode.toggleInstaceRelation();
}
