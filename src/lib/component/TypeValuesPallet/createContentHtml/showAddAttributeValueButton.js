export default function (isLock) {
  return isLock
    ? ''
    : `
              <th>
                <span class="textae-editor__pallet__add-attribute-value-button" title="Add new value"></span>
              </th>`
}
