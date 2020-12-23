import toButtonIcon from './toButtonIcon'

export default function () {
  return ({ list }) => `
  <span class="textae-control__separator"></span>
  ${list.map(toButtonIcon).join('\n')}
  `
}
