import toggleModification from './toggleModification'

module.exports = function(command, annotationData, modeAccordingToButton, typeEditor) {
  return {
    negation: () => {
      toggleModification(command, annotationData, modeAccordingToButton, 'Negation', typeEditor)
    },
    speculation: () => {
      toggleModification(command, annotationData, modeAccordingToButton, 'Speculation', typeEditor)
    }
  }
}
