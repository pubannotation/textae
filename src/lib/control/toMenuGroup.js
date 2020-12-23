import toMenuItem from './toMenuItem'

export default function () {
  return ({ list }) => `
  <p class="textae-control__separator"></p>
  ${list.map(toMenuItem()).join('\n')}
  `
}
