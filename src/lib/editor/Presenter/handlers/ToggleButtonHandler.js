export default function(modeAccordingToButton, editMode) {
    return {
        toggleViewMode: () => toggleViewMode(modeAccordingToButton, editMode),
        toTermMode: () => toTermMode(modeAccordingToButton, editMode),
        toRelationMode: () => toRelationMode(modeAccordingToButton, editMode),
        toSimpleMode: () => toSimpleMode(modeAccordingToButton, editMode),
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

function toTermMode(modeAccordingToButton, editMode) {
    if (!modeAccordingToButton.term.value()) {
        editMode.pushTerm();
    }
}

function toRelationMode(modeAccordingToButton, editMode) {
    if (!modeAccordingToButton.relation.value()) {
        editMode.pushRelation();
    }
}

function toSimpleMode(modeAccordingToButton, editMode) {
    if (!modeAccordingToButton.simple.value()) {
        editMode.pushSimple();
    }
}

function toggleDetectBoundaryMode(modeAccordingToButton) {
    modeAccordingToButton['boundary-detection'].toggle();
}

function toggleInstaceRelation(editMode) {
    editMode.toggleInstaceRelation();
}
