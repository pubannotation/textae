import toggleModification from './toggleModification'

export default function(commander, pushButtons, typeEditor) {
  return {
    negation: () => {
      toggleModification(commander, pushButtons, 'Negation', typeEditor)
    },
    speculation: () => {
      toggleModification(commander, pushButtons, 'Speculation', typeEditor)
    }
  }
}
