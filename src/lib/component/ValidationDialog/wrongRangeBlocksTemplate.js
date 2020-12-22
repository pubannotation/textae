export default function (wrongRangeBlocks) {
  return wrongRangeBlocks.length
    ? `
        <table>
          <caption>Wrong range blocks.</caption>
          <thead>
            <tr>
              <th class="id">id</th>
              <th class="range">begin</th>
              <th class="range">end</th>
              <th>obj</th>
            </tr>
          </thead>
          <tbody>
            ${wrongRangeBlocks
              .map(
                ({ id, span, obj }) => `
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
