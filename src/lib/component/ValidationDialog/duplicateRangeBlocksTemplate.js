import anemone from '../anemone'

export default function (duplicatedRangeBlocks) {
  return duplicatedRangeBlocks.length
    ? anemone`
      <table>
        <caption>Duplicated range blocks.</caption>
        <thead>
          <tr>
            <th class="id">id</th>
            <th class="range">begin</th>
            <th class="range">end</th>
            <th>obj</th>
          </tr>
        </thead>
        <tbody>
          ${() =>
            duplicatedRangeBlocks.map(
              ({ id, span, obj }) => anemone`
          <tr>
            <td>${id || ''}</td>
            <td class="alert">${span.begin}</td>
            <td class="alert">${span.end}</td>
            <td>${obj}</td>
          </tr>
          `
            )}
        </tbody>
      </table>
      `
    : ''
}
