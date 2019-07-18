import toggleModification from './toggleModification'

export default function(command, annotationData, pushButtons, typeEditor) {
  return {
    negation: () => {
      toggleModification(command, annotationData, pushButtons, 'Negation', typeEditor)
    },
    speculation: () => {
      toggleModification(command, annotationData, pushButtons, 'Speculation', typeEditor)
    }
  }
}
