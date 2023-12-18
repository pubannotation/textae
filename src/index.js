import textae from './lib/textae'
import packageJson from '../package.json'

document.addEventListener('DOMContentLoaded', textae)

// This function is experimental.
// It is being released to verify its feasibility for integration into React.
window.initializeTextAEEditor = textae

console.log(`TextAE Version ${packageJson.version} loaded.`)
