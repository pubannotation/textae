var toggleModification = require('./toggleModification');

module.exports = function(command, annotationData, modeAccordingToButton, typeEditor) {
    return {
        negation: function() {
            toggleModification(command, annotationData, modeAccordingToButton, 'Negation', typeEditor);
        },
        speculation: function() {
            toggleModification(command, annotationData, modeAccordingToButton, 'Speculation', typeEditor);
        }
    };
};
