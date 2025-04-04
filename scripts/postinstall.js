// Only run postinstall when executing npm install in this project (during development).
// npm sets the directory where the npm command was initially executed as the environment variable INIT_CWD.
// When running npm install within this project, INIT_CWD and the current directory (process.cwd()) are identical.
// When installed as a library in other projects, the current directory becomes a subdirectory under node_modules, and thus the two values will not match.
if (process.env.INIT_CWD !== process.cwd()) {
  console.log('Postinstall script skipped: installed as a library.')
  process.exit(0)
}

const { execSync } = require('child_process')
const { copySync } = require('cpx2')

try {
  console.log('Running husky installation...')
  execSync('npx husky', { stdio: 'inherit' })

  console.log('Copying Font Awesome fonts...')
  copySync('node_modules/font-awesome/fonts/**', 'src/lib/fonts', {
    clean: true
  })

  console.log('Postinstall scripts completed successfully.')
  process.exit(0)
} catch (error) {
  console.error('Postinstall scripts failed:', error)
  process.exit(1)
}
