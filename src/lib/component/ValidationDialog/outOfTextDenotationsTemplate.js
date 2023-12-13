import anemone from '../anemone'

export default function (outOfTextDenotations) {
  return outOfTextDenotations.length
    ? anemone`
        <table>
          <caption>Out of text denotations.</caption>
          <thead>
            <tr>
              <th class="id">id</th>
              <th class="range">begin</th>
              <th class="range">end</th>
              <th>obj</th>
            </tr>
          </thead>
          <tbody>
            ${outOfTextDenotations.map(({ id, span, obj }) =>
              toBodyRow(id, span, obj)
            )}
          </tbody>
        </table>`
    : ''
}

function toBodyRow(id, span, obj) {
  return () => anemone`
    <tr>
      <td>${id || ''}</td>
      <td class="alert">${span.begin}</td>
      <td class="alert">${span.end}</td>
      <td>${obj}</td>
    </tr>
    `
}
