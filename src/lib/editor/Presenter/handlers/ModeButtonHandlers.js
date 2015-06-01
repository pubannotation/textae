export default function(modeAccordingToButton, editMode) {
    return {
        toTermMode: () => toTermMode(modeAccordingToButton, editMode),
        toRelationMode: () => toRelationMode(modeAccordingToButton, editMode),
        toSimpleMode: () => toSimpleMode(modeAccordingToButton, editMode)
    };
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
