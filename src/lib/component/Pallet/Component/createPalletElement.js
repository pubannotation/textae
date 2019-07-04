import CLASS_NAMES from '../className'

export default function() {
  const pallet = document.createElement('div')
  pallet.classList.add(CLASS_NAMES.base)
  pallet.style.display = 'none'

  const title = document.createElement('p')
  title.classList.add(CLASS_NAMES.title)
  pallet.appendChild(title)

  const titleText = document.createElement('span')
  titleText.classList.add(CLASS_NAMES.titleText)
  title.appendChild(titleText)

  const lockIcon = document.createElement('span')
  lockIcon.classList.add(CLASS_NAMES.lockIcon)
  lockIcon.innerText = 'locked'
  title.appendChild(lockIcon)

  const buttonContainer = document.createElement('div')
  buttonContainer.classList.add(CLASS_NAMES.buttons)
  buttonContainer.classList.add(CLASS_NAMES.hideWhenLocked)
  pallet.appendChild(buttonContainer)

  const addButton = document.createElement('span')
  addButton.classList.add(CLASS_NAMES.button)
  addButton.classList.add(CLASS_NAMES.buttonAdd)
  addButton.setAttribute('title', 'Add new type')
  buttonContainer.appendChild(addButton)

  const readButton = document.createElement('span')
  readButton.classList.add(CLASS_NAMES.button)
  readButton.classList.add(CLASS_NAMES.buttonRead)
  readButton.setAttribute('title', 'Import')
  buttonContainer.appendChild(readButton)

  const writeButton = document.createElement('span')
  writeButton.classList.add(CLASS_NAMES.button)
  writeButton.classList.add(CLASS_NAMES.buttonWrite)
  writeButton.setAttribute('title', 'Upload')
  buttonContainer.appendChild(writeButton)

  pallet.appendChild(document.createElement('table'))

  return pallet
}
