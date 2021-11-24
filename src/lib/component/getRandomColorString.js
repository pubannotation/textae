export default function () {
  return `#${getRandomHEXFrom64ToFF()}${getRandomHEXFrom64ToFF()}${getRandomHEXFrom64ToFF()}`
}

function getRandomHEXFrom64ToFF() {
  return Math.floor(Math.random() * 155 + 100).toString(16)
}
