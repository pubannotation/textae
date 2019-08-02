import toggleModification from './toggleModification'

export default function(command, pushButtons, typeEditor) {
  return {
    negation: () => {
      toggleModification(command, pushButtons, 'Negation', typeEditor)
    },
    speculation: () => {
      toggleModification(command, pushButtons, 'Speculation', typeEditor)
    }
  }
}
