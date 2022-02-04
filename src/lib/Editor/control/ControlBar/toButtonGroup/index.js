import toButtonIcon from './toButtonIcon'

export default function () {
  return (list) => `
  <span class="textae-control-separator"></span>
  ${list.map(toButtonIcon).join('\n')}
  `
}
