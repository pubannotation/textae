import anemone from '../anemone'

export default function (outOfTextBlocks) {
  return outOfTextBlocks.length
    ? anemone`
      <table>
        <caption>Out of text blocks.</caption>
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
            outOfTextBlocks
              .map(
                ({ id, span, obj }) => anemone`
          <tr>
            <td>${id || ''}</td>
            <td class="alert">${span.begin}</td>
            <td class="alert">${span.end}</td>
            <td>${obj}</td>
          </tr>
          `
              )
              .join('\n')}
        </tbody>
      </table>
      `
    : ''
}
