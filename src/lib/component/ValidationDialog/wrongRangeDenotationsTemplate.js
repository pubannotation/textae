import anemone from '../anemone'

export default function (wrongRangeDenotations) {
  return wrongRangeDenotations.length
    ? anemone`
        <table>
          <caption>Wrong range denotations.</caption>
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
              wrongRangeDenotations.map(
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
        </table>`
    : ''
}
