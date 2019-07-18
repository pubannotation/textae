import toggleModification from './toggleModification'

export default function(command, annotationData, modeAccordingToButton, typeEditor) {
  return {
    negation: () => {
      toggleModification(command, annotationData, modeAccordingToButton, 'Negation', typeEditor)
    },
    speculation: () => {
      toggleModification(command, annotationData, modeAccordingToButton, 'Speculation', typeEditor)
    }
  }
}
